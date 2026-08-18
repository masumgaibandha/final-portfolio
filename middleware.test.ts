import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { middleware } from "./middleware";

/**
 * Tests the actual Basic Auth enforcement that protects
 * `/masterclass/admin/**` — the "unauthorized verification attempt" case
 * from the test plan. No mocking needed: `middleware()` is a pure function
 * of `NextRequest` + `process.env`.
 */
describe("masterclass admin middleware", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 401 when no credentials are configured at all (fails closed, never a default credential)", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "");

    const request = new NextRequest("https://masumdev.com/masterclass/admin/orders");
    const response = middleware(request);

    expect(response.status).toBe(401);
    expect(response.headers.get("WWW-Authenticate")).toContain("Basic");
  });

  it("returns 401 for a request with no Authorization header", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "owner");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "correct-horse-battery-staple");

    const request = new NextRequest("https://masumdev.com/masterclass/admin/orders");
    const response = middleware(request);

    expect(response.status).toBe(401);
  });

  it("returns 401 for the wrong password", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "owner");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "correct-horse-battery-staple");

    const credentials = Buffer.from("owner:wrong-password").toString("base64");
    const request = new NextRequest("https://masumdev.com/masterclass/admin/orders", {
      headers: { authorization: `Basic ${credentials}` },
    });
    const response = middleware(request);

    expect(response.status).toBe(401);
  });

  it("allows the request through with the correct username and password", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "owner");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "correct-horse-battery-staple");

    const credentials = Buffer.from("owner:correct-horse-battery-staple").toString("base64");
    const request = new NextRequest("https://masumdev.com/masterclass/admin/orders", {
      headers: { authorization: `Basic ${credentials}` },
    });
    const response = middleware(request);

    expect(response.status).toBe(200); // NextResponse.next() reports as a 200 passthrough in this test context
  });
});
