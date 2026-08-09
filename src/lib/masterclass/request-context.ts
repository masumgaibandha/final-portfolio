/**
 * Server-derived request context only — nothing here ever reads a
 * client-submitted IP or user-agent value from a request body. Neither
 * function logs its input or output; invalid/missing values resolve to
 * `null` rather than throwing, so a malformed header can never fail a
 * registration.
 *
 * Trusted-proxy behavior must be reconfirmed for the final Vercel
 * deployment before `clientIpAddress` is used for Meta CAPI — Vercel's edge
 * network sets `x-forwarded-for` itself today, but if a custom proxy or CDN
 * is ever added in front of it, "the first syntactically valid entry" may
 * no longer be the genuine client IP and this logic will need revisiting.
 */

const MAX_IP_LENGTH = 64;
const MAX_USER_AGENT_LENGTH = 512;

const IPV4_PATTERN = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
/* Loose IPv6 syntax check — good enough to reject obvious garbage, not a full RFC 4291 validator. */
const IPV6_PATTERN = /^[0-9a-fA-F:]+$/;

function isSyntacticallyValidIp(candidate: string): boolean {
  if (candidate.length === 0 || candidate.length > MAX_IP_LENGTH) return false;

  const ipv4Match = IPV4_PATTERN.exec(candidate);
  if (ipv4Match) {
    return ipv4Match.slice(1, 5).every((octet) => Number(octet) <= 255);
  }

  return candidate.includes(":") && IPV6_PATTERN.test(candidate);
}

/** Scans a comma-separated `x-forwarded-for` list and keeps the first entry that is syntactically a valid IP. */
export function extractClientIp(headers: Headers): string | null {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    for (const candidate of forwardedFor.split(",")) {
      const trimmed = candidate.trim();
      if (isSyntacticallyValidIp(trimmed)) {
        return trimmed.slice(0, MAX_IP_LENGTH);
      }
    }
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp && isSyntacticallyValidIp(realIp)) {
    return realIp.slice(0, MAX_IP_LENGTH);
  }

  return null;
}

export function extractClientUserAgent(headers: Headers): string | null {
  const userAgent = headers.get("user-agent")?.trim();
  if (!userAgent) return null;
  return userAgent.slice(0, MAX_USER_AGENT_LENGTH);
}
