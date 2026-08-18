import "server-only";
import { headers } from "next/headers";

import { timingSafeStringEqual } from "@/lib/masterclass/timing-safe-equal";

/**
 * The one centralized authorization check for every masterclass admin
 * mutation and read — approve, reject, retry a failed email/CAPI send, and
 * the admin queue page itself all call `requireMasterclassAdmin()` as their
 * first line, before touching any repository, service, email, or Meta call.
 *
 * `middleware.ts` also checks Basic Auth, scoped to `/masterclass/admin/**`,
 * but that is defense-in-depth, not the authorization boundary. Next.js
 * Server Actions are dispatched by an action-ID lookup that isn't strictly
 * bound to the URL a middleware `matcher` protects — a raw POST carrying a
 * valid action reference can reach a Server Action's code without ever
 * passing through the middleware for the route that action was defined on.
 * (This is exactly why the Next.js docs say to treat every Server Action as
 * an independently reachable endpoint and authorize inside it.) So this
 * function re-derives and re-verifies the Basic Auth credentials from
 * scratch, every time, regardless of what already ran before it.
 */

export class UnauthorizedAdminError extends Error {
  constructor() {
    super("Admin authorization failed.");
    this.name = "UnauthorizedAdminError";
  }
}

function decodeBasicAuth(authHeader: string): { user: string; password: string } | null {
  if (!authHeader.startsWith("Basic ")) return null;

  let decoded: string;
  try {
    decoded = Buffer.from(authHeader.slice("Basic ".length), "base64").toString("utf-8");
  } catch {
    return null;
  }

  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) return null;

  return { user: decoded.slice(0, separatorIndex), password: decoded.slice(separatorIndex + 1) };
}

/**
 * Verifies the caller's `Authorization: Basic` header against
 * `MASTERCLASS_ADMIN_USER`/`MASTERCLASS_ADMIN_PASSWORD` and returns the
 * verified username (for `verifiedBy` on the payment order) — or throws
 * `UnauthorizedAdminError`, never returns `null`/`false`, so a caller can't
 * accidentally skip the check by forgetting to inspect a boolean.
 *
 * Rejects (throws) when: either env var is unset (fails closed — never a
 * default/bypass credential); the header is missing, malformed, or not
 * `Basic`; or the supplied username/password don't both match, compared
 * with the same timing-safe function `middleware.ts` uses. The error
 * message is always the same generic string — never echoes which part of
 * the check failed or any part of the submitted credentials.
 */
export async function requireMasterclassAdmin(): Promise<string> {
  const expectedUser = process.env.MASTERCLASS_ADMIN_USER;
  const expectedPassword = process.env.MASTERCLASS_ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    throw new UnauthorizedAdminError();
  }

  const headerList = await headers();
  const authHeader = headerList.get("authorization");
  if (!authHeader) {
    throw new UnauthorizedAdminError();
  }

  const credentials = decodeBasicAuth(authHeader);
  if (!credentials) {
    throw new UnauthorizedAdminError();
  }

  if (
    !timingSafeStringEqual(credentials.user, expectedUser) ||
    !timingSafeStringEqual(credentials.password, expectedPassword)
  ) {
    throw new UnauthorizedAdminError();
  }

  return credentials.user;
}
