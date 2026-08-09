import { NextResponse, type NextRequest } from "next/server";

import { getSecurityEnv, isRegistrationEnabled } from "@/lib/env";
import { isPrivacyPolicyPublished } from "@/lib/masterclass/constants";
import { isRequestSameOrigin } from "@/lib/masterclass/origin-validation";
import { checkRateLimit } from "@/lib/masterclass/rate-limit";
import { registerForMasterclass } from "@/lib/masterclass/registration-service";
import { extractClientIp, extractClientUserAgent } from "@/lib/masterclass/request-context";
import { getAllowedTurnstileHostnames, validateTurnstileToken } from "@/lib/masterclass/turnstile";
import {
  idempotencyKeySchema,
  normalizeBangladeshPhone,
  registrationInputSchema,
  toValidationFailures,
} from "@/lib/masterclass/validation";

/*
 * The `mongodb` driver needs the Node.js runtime, not Edge. `force-dynamic`
 * keeps this route out of any static/ISR caching — every request must be
 * evaluated fresh (the disabled-check alone is a good reason not to cache).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 10_000;

function noStoreJson(
  body: unknown,
  status: number,
  extraHeaders?: Record<string, string>,
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extraHeaders },
  });
}

/*
 * Secure processing order (Phase 3B). Each step's failure response is
 * generic and never reveals *why* — a rejected request looks the same
 * whether it failed origin validation, rate limiting, or bot verification,
 * beyond the necessarily-distinct HTTP status and error code.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  /*
   * 1. Registration/privacy/security configuration gate — checked first,
   * before anything else touches the request body or MongoDB. Folding the
   * security-config check into the same generic response as the
   * enabled-flag/privacy-policy checks means a misconfigured deployment
   * (e.g. TURNSTILE_SECRET_KEY forgotten) fails exactly like the ordinary
   * disabled state from the outside — never "closer to open."
   */
  const securityEnv = getSecurityEnv();
  if (!isRegistrationEnabled() || !isPrivacyPolicyPublished() || !securityEnv) {
    return noStoreJson({ error: "REGISTRATION_NOT_OPEN" }, 503);
  }

  // 2. Same-origin validation — no permissive CORS, no reflected origin.
  if (!isRequestSameOrigin(request.headers, securityEnv.allowedOrigins)) {
    return noStoreJson({ error: "REQUEST_NOT_ALLOWED" }, 403);
  }

  // 3. Trusted request-context extraction.
  const clientIpAddress = extractClientIp(request.headers);
  const clientUserAgent = extractClientUserAgent(request.headers);
  if (!clientIpAddress) {
    return noStoreJson({ error: "REQUEST_CONTEXT_UNAVAILABLE" }, 400);
  }

  // 4. IP rate-limit check.
  const ipRateLimit = await checkRateLimit({
    scope: "ip",
    subject: clientIpAddress,
    secret: securityEnv.rateLimitSecret,
  });
  if (!ipRateLimit.allowed) {
    return noStoreJson({ error: "RATE_LIMITED" }, 429, {
      "Retry-After": String(ipRateLimit.retryAfterSeconds),
    });
  }

  // 5. Existing body-size enforcement (content-type + idempotency-key are header checks that belong alongside it, before the body is trusted).
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return noStoreJson({ error: "UNSUPPORTED_MEDIA_TYPE" }, 415);
  }

  const idempotencyKeyResult = idempotencyKeySchema.safeParse(
    request.headers.get("idempotency-key") ?? "",
  );
  if (!idempotencyKeyResult.success) {
    return noStoreJson({ error: "INVALID_IDEMPOTENCY_KEY" }, 400);
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return noStoreJson({ error: "PAYLOAD_TOO_LARGE" }, 413);
  }

  // 6. JSON parsing and schema validation, including the Turnstile token.
  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return noStoreJson({ error: "MALFORMED_JSON" }, 400);
  }

  const inputResult = registrationInputSchema.safeParse(parsedBody);
  if (!inputResult.success) {
    return noStoreJson(
      { error: "VALIDATION_ERROR", fields: toValidationFailures(inputResult.error) },
      422,
    );
  }

  const emailNormalized = inputResult.data.email.toLowerCase();
  const phoneE164 = normalizeBangladeshPhone(inputResult.data.phone);
  if (!phoneE164) {
    /* Unreachable in practice — the schema already checked this — but never trust a bypassed schema. */
    return noStoreJson(
      {
        error: "VALIDATION_ERROR",
        fields: [{ field: "phone", message: "Enter a valid Bangladeshi mobile number." }],
      },
      422,
    );
  }

  // 7. Turnstile Siteverify validation.
  const turnstileResult = await validateTurnstileToken({
    token: inputResult.data.turnstileToken,
    remoteIp: clientIpAddress,
    secretKey: securityEnv.turnstileSecretKey,
    allowedHostnames: getAllowedTurnstileHostnames(),
  });
  if (!turnstileResult.ok) {
    const status = turnstileResult.reason === "VERIFICATION_UNAVAILABLE" ? 503 : 403;
    return noStoreJson({ error: turnstileResult.reason }, status);
  }

  /*
   * 8. Normalized-email rate-limit check. Note: an *exact* idempotent retry
   * (same Idempotency-Key, same body) still reaches this point and still
   * consumes one unit of both the IP and email rate-limit capacity, even
   * though `registerForMasterclass` below will just return the same cached
   * result rather than writing anything new. This is intentional — skipping
   * rate-limit accounting for "looks like a replay" requests would let an
   * attacker probe the limiter's behavior for free, and legitimate retries
   * are rare enough that the extra capacity consumed is not a real cost.
   */
  const emailRateLimit = await checkRateLimit({
    scope: "email",
    subject: emailNormalized,
    secret: securityEnv.rateLimitSecret,
  });
  if (!emailRateLimit.allowed) {
    return noStoreJson({ error: "RATE_LIMITED" }, 429, {
      "Retry-After": String(emailRateLimit.retryAfterSeconds),
    });
  }

  // 9-10. Existing transactional registration/order service, then a sanitized response — unchanged from Phase 2.
  try {
    const result = await registerForMasterclass({
      input: inputResult.data,
      emailNormalized,
      phoneE164,
      idempotencyKey: idempotencyKeyResult.data,
      clientIpAddress,
      clientUserAgent,
    });

    switch (result.kind) {
      case "ok":
        return noStoreJson(
          {
            publicRegistrationRef: result.publicRegistrationRef,
            publicOrderRef: result.publicOrderRef,
            status: result.status,
          },
          201,
        );
      case "registration_conflict":
        return noStoreJson({ error: "REGISTRATION_CONFLICT" }, 409);
      case "idempotency_conflict":
        return noStoreJson({ error: "IDEMPOTENCY_CONFLICT" }, 409);
    }
  } catch (error) {
    /* Safe to log: a message only, never the request body or a secret. */
    console.error(
      "[masterclass/registrations] Unexpected error:",
      error instanceof Error ? error.message : "unknown error",
    );
    return noStoreJson({ error: "INTERNAL_ERROR" }, 500);
  }
}
