import { NextResponse, type NextRequest } from "next/server";

import { timingSafeStringEqual } from "@/lib/masterclass/timing-safe-equal";

/*
 * The only middleware in this project — scoped by `config.matcher` below to
 * exactly `/masterclass/admin/**`, so every other route (the homepage, blog,
 * resources, legal pages, the masterclass sales page itself, all API routes)
 * is completely untouched by this file.
 *
 * HTTP Basic Auth, checked here, server-side, before any admin page render
 * reaches the browser. Deliberately not a hidden-URL-only or client-side
 * check: credentials never reach a Client Component or the browser bundle,
 * only ever compared against the `Authorization` header the browser itself
 * sends after prompting the operator. `MASTERCLASS_ADMIN_USER`/
 * `MASTERCLASS_ADMIN_PASSWORD` are the only two new env vars this depends
 * on; if either is unset, the route fails closed (401 for every request,
 * never a default/bypass credential).
 *
 * IMPORTANT: this is defense-in-depth, not the only authorization layer.
 * Next.js Server Actions are independently reachable endpoints — a POST
 * carrying a valid action reference is not guaranteed to route through this
 * middleware's path matcher. Every admin Server Action independently
 * re-verifies the same credentials via `requireMasterclassAdmin()`
 * (`src/lib/masterclass/admin-auth.ts`), which is the layer that actually
 * gates any database mutation, email send, or Meta CAPI call — not this
 * file. See that module's doc comment for the full reasoning.
 */

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Masterclass Admin"' },
  });
}

export function middleware(request: NextRequest): NextResponse {
  const expectedUser = process.env.MASTERCLASS_ADMIN_USER;
  const expectedPassword = process.env.MASTERCLASS_ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    return unauthorized();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded: string;
  try {
    decoded = Buffer.from(authHeader.slice("Basic ".length), "base64").toString("utf-8");
  } catch {
    return unauthorized();
  }

  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) return unauthorized();

  const suppliedUser = decoded.slice(0, separatorIndex);
  const suppliedPassword = decoded.slice(separatorIndex + 1);

  if (
    !timingSafeStringEqual(suppliedUser, expectedUser) ||
    !timingSafeStringEqual(suppliedPassword, expectedPassword)
  ) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/masterclass/admin/:path*"],
};
