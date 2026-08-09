import { NextResponse, type NextRequest } from "next/server";

import { isPrivacyPolicyPublished } from "@/lib/masterclass/constants";
import { isRegistrationEnabled } from "@/lib/env";
import { registerForMasterclass } from "@/lib/masterclass/registration-service";
import { extractClientIp, extractClientUserAgent } from "@/lib/masterclass/request-context";
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

function noStoreJson(body: unknown, status: number): NextResponse {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  /*
   * Both checked first, before anything else touches the request body or
   * MongoDB. The privacy-policy check is deliberately folded into the same
   * generic response as the enabled-flag check — an accidental
   * `MASTERCLASS_REGISTRATION_ENABLED=true` with no published privacy
   * policy must fail exactly the same way from the outside, not leak that
   * it's "closer to open" than the normal disabled state.
   */
  if (!isRegistrationEnabled() || !isPrivacyPolicyPublished()) {
    return noStoreJson({ error: "REGISTRATION_NOT_OPEN" }, 503);
  }

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

  try {
    const result = await registerForMasterclass({
      input: inputResult.data,
      emailNormalized,
      phoneE164,
      idempotencyKey: idempotencyKeyResult.data,
      clientIpAddress: extractClientIp(request.headers),
      clientUserAgent: extractClientUserAgent(request.headers),
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
