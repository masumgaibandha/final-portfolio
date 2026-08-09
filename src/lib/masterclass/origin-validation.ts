/**
 * Same-origin enforcement for the registration POST route only — this is
 * deliberately not a general CORS layer. It never reflects an origin back,
 * never sets an `Access-Control-*` header, and never logs a rejected
 * origin; it only ever answers true/false, and the caller (the route) is
 * responsible for turning `false` into a generic `403`.
 */

function isLocalhostHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

/** `scheme//host` (host includes a non-default port) — the normalized form an Origin header should match exactly. */
function normalizeOrigin(raw: string): string | null {
  try {
    const url = new URL(raw);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

function originHostname(origin: string): string | null {
  try {
    return new URL(origin).hostname;
  } catch {
    return null;
  }
}

/**
 * `allowedOrigins` is the raw, parsed `MASTERCLASS_ALLOWED_ORIGINS` list
 * from `getSecurityEnv()`. In production, any localhost-hostname entry in
 * that list is ignored here as a defense-in-depth safety net — a
 * misconfigured env var (e.g. the `.env.example` default, which includes
 * `http://localhost:3000` for local development) must never grant a
 * localhost origin real access once `NODE_ENV === "production"`.
 */
export function isRequestSameOrigin(
  headers: Headers,
  allowedOrigins: readonly string[],
): boolean {
  const originHeader = headers.get("origin");
  if (!originHeader || originHeader === "null") return false;

  const normalizedOrigin = normalizeOrigin(originHeader);
  if (!normalizedOrigin) return false;

  const isProduction = process.env.NODE_ENV === "production";
  const effectiveAllowlist = isProduction
    ? allowedOrigins.filter((origin) => {
        const hostname = originHostname(origin);
        return hostname !== null && !isLocalhostHostname(hostname);
      })
    : allowedOrigins;

  if (!effectiveAllowlist.includes(normalizedOrigin)) return false;

  /* Not every client sends this header, so its absence isn't itself a rejection — but if it's present, it must say same-origin/same-site. */
  const secFetchSite = headers.get("sec-fetch-site");
  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site") {
    return false;
  }

  return true;
}
