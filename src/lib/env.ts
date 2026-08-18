import "server-only";

import { isPrivacyPolicyPublished } from "@/lib/masterclass/constants";

/**
 * Server-only environment accessors. Every function throws or returns a
 * clear failure when a required variable is missing — but none of them read
 * `process.env` at module load, only when called. Importing this file (even
 * transitively, e.g. during static generation) never throws and never
 * touches MongoDB or a secret by itself.
 *
 * The `server-only` import above makes any accidental import from a Client
 * Component a build-time error rather than a silent runtime bug — verified
 * before adding it that every current importer (`route.ts`, `mongodb.ts`,
 * `Registration.tsx`) is server-only already.
 */

interface MongoEnv {
  uri: string;
  dbName: string;
}

export function getMongoEnv(): MongoEnv {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env and fill in a connection string.",
    );
  }
  if (!dbName) {
    throw new Error(
      "MONGODB_DB is not set. Copy .env.example to .env and fill in a database name.",
    );
  }

  return { uri, dbName };
}

/** The literal string "true" — anything else (including unset) means disabled. */
export function isRegistrationEnabled(): boolean {
  return process.env.MASTERCLASS_REGISTRATION_ENABLED === "true";
}

export interface SecurityEnv {
  turnstileSecretKey: string;
  rateLimitSecret: string;
  /** Raw, parsed `MASTERCLASS_ALLOWED_ORIGINS` list — no localhost filtering applied here; see `origin-validation.ts`. */
  allowedOrigins: readonly string[];
}

function parseAllowedOrigins(raw: string): string[] {
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

/**
 * `null` if Turnstile, rate-limit, or origin-allowlist configuration is
 * missing or empty — never a fallback secret, never (e.g.) Cloudflare's
 * official always-passes test key. The registration route treats a `null`
 * here exactly like `isRegistrationEnabled() === false`: a generic
 * `503 REGISTRATION_NOT_OPEN`, before anything else runs.
 */
export function getSecurityEnv(): SecurityEnv | null {
  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
  const rateLimitSecret = process.env.MASTERCLASS_RATE_LIMIT_SECRET;
  const rawAllowedOrigins = process.env.MASTERCLASS_ALLOWED_ORIGINS;

  if (!turnstileSecretKey || !rateLimitSecret || !rawAllowedOrigins) {
    return null;
  }

  const allowedOrigins = parseAllowedOrigins(rawAllowedOrigins);
  if (allowedOrigins.length === 0) {
    return null;
  }

  return { turnstileSecretKey, rateLimitSecret, allowedOrigins };
}

export interface ManualPaymentMethodEnv {
  enabled: boolean;
  number: string | null;
}

export interface ManualPaymentEnv {
  bkash: ManualPaymentMethodEnv;
  nagad: ManualPaymentMethodEnv;
  rocket: ManualPaymentMethodEnv;
}

/**
 * Per-method: `enabled` only when its payment number is actually configured.
 * Never throws — an unconfigured method is simply hidden from the payment
 * picker rather than presenting a broken flow. Numbers are read lazily here,
 * not cached at module load, matching every other accessor in this file.
 */
export function getManualPaymentEnv(): ManualPaymentEnv {
  const bkash = process.env.MASTERCLASS_BKASH_NUMBER?.trim() || null;
  const nagad = process.env.MASTERCLASS_NAGAD_NUMBER?.trim() || null;
  const rocket = process.env.MASTERCLASS_ROCKET_NUMBER?.trim() || null;

  return {
    bkash: { enabled: bkash !== null, number: bkash },
    nagad: { enabled: nagad !== null, number: nagad },
    rocket: { enabled: rocket !== null, number: rocket },
  };
}

export interface AdminAuthEnv {
  username: string;
  password: string;
}

/** `null` if either credential is missing — the admin route fails closed (see `middleware.ts`), never with a default credential. */
export function getAdminAuthEnv(): AdminAuthEnv | null {
  const username = process.env.MASTERCLASS_ADMIN_USER;
  const password = process.env.MASTERCLASS_ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

export interface MetaEnv {
  pixelId: string;
  capiAccessToken: string;
}

/**
 * Server-side Conversions API config — `null` if either half is missing.
 * Distinct from `NEXT_PUBLIC_META_PIXEL_ID`, which is public by design (the
 * browser Pixel ID) and read directly where needed; `capiAccessToken` must
 * never reach a Client Component.
 */
export function getMetaCapiEnv(): MetaEnv | null {
  const pixelId = process.env.META_PIXEL_ID;
  const capiAccessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !capiAccessToken) return null;
  return { pixelId, capiAccessToken };
}

/**
 * The full server-controlled readiness gate for the registration form —
 * deliberately a single boolean, never the underlying reasons. A Server
 * Component uses this (alongside the separate, non-secret
 * `masterclassConfig.checkoutEnabled` and a present
 * `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, both read directly in `Registration.tsx`
 * since neither is sensitive) to decide whether to render the interactive
 * form at all. Bundling `getSecurityEnv()` in here means nothing outside
 * this file ever needs to call it directly — one fewer place a future
 * change could accidentally leak a `SecurityEnv` value toward the client.
 *
 * True only when all three hold: `MASTERCLASS_REGISTRATION_ENABLED`,
 * a published privacy policy (not the `"unpublished-draft"` placeholder),
 * and complete Turnstile/rate-limit/origin security configuration.
 */
export function isRegistrationOperationallyReady(): boolean {
  return isRegistrationEnabled() && isPrivacyPolicyPublished() && getSecurityEnv() !== null;
}
