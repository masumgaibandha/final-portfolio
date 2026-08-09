/**
 * Server-only environment accessors. Every function throws or returns a
 * clear failure when a required variable is missing — but none of them read
 * `process.env` at module load, only when called. Importing this file (even
 * transitively, e.g. during static generation) never throws and never
 * touches MongoDB or a secret by itself.
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
