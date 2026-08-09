import { randomUUID } from "node:crypto";

/**
 * Server-only Cloudflare Turnstile validation. Never imported by a Client
 * Component — `TURNSTILE_SECRET_KEY` only ever exists in this file's
 * `process.env` read, which only route handlers (Node runtime) can reach.
 * Never logs the token, the raw Cloudflare response, or an `error-codes`
 * array; never persists the token anywhere.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const REQUEST_TIMEOUT_MS = 5000;
const MAX_ATTEMPTS = 2;
const EXPECTED_ACTION = "masterclass_registration";

export type TurnstileFailureReason = "BOT_VERIFICATION_FAILED" | "VERIFICATION_UNAVAILABLE";

export type TurnstileValidationResult =
  | { ok: true }
  | { ok: false; reason: TurnstileFailureReason };

export interface TurnstileValidationInput {
  token: string;
  /** Already-validated, syntactically-checked client IP — passed straight through, never re-derived here. */
  remoteIp: string | null;
  secretKey: string;
  allowedHostnames: readonly string[];
}

interface SiteverifyResponse {
  success?: unknown;
  action?: unknown;
  hostname?: unknown;
}

/** Production only ever allows the real apex/www hostnames; non-production also allows localhost for local testing. */
export function getAllowedTurnstileHostnames(): string[] {
  if (process.env.NODE_ENV === "production") {
    return ["masumdev.com", "www.masumdev.com"];
  }
  return ["masumdev.com", "www.masumdev.com", "localhost"];
}

async function callSiteverify(body: URLSearchParams): Promise<SiteverifyResponse | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const json: unknown = await response.json();
    if (typeof json !== "object" || json === null) return null;
    return json as SiteverifyResponse;
  } catch {
    /* Timeout, abort, network error, or a non-JSON body — all fold into the same "couldn't verify" outcome. */
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * At most two Siteverify attempts, reusing the same generated
 * `idempotency_key` across both — Cloudflare's documented mechanism for a
 * safe retry: if the first attempt actually succeeded server-side but the
 * response was lost to a timeout, the retry returns the same result instead
 * of rejecting an already-consumed (single-use) token.
 */
export async function validateTurnstileToken(
  input: TurnstileValidationInput,
): Promise<TurnstileValidationResult> {
  const idempotencyKey = randomUUID();
  const params = new URLSearchParams();
  params.set("secret", input.secretKey);
  params.set("response", input.token);
  if (input.remoteIp) params.set("remoteip", input.remoteIp);
  params.set("idempotency_key", idempotencyKey);

  let response: SiteverifyResponse | null = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS && response === null; attempt++) {
    response = await callSiteverify(params);
  }

  if (response === null) {
    return { ok: false, reason: "VERIFICATION_UNAVAILABLE" };
  }

  if (response.success !== true) {
    return { ok: false, reason: "BOT_VERIFICATION_FAILED" };
  }

  if (typeof response.action !== "string" || response.action !== EXPECTED_ACTION) {
    return { ok: false, reason: "BOT_VERIFICATION_FAILED" };
  }

  if (
    typeof response.hostname !== "string" ||
    !input.allowedHostnames.includes(response.hostname)
  ) {
    return { ok: false, reason: "BOT_VERIFICATION_FAILED" };
  }

  return { ok: true };
}
