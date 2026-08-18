import { afterEach, describe, expect, it, vi } from "vitest";

/*
 * `next/headers` is mocked to return a real Web `Headers` instance built
 * from whatever the test configures — this exercises `requireMasterclassAdmin()`'s
 * actual decoding/comparison logic, not a stand-in.
 */
let mockHeaders = new Headers();
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => mockHeaders),
}));

const { requireMasterclassAdmin, UnauthorizedAdminError } = await import("@/lib/masterclass/admin-auth");

function basicAuthHeader(user: string, password: string): string {
  return `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
}

afterEach(() => {
  vi.unstubAllEnvs();
  mockHeaders = new Headers();
});

describe("requireMasterclassAdmin", () => {
  it("rejects when no admin credentials are configured at all — fails closed, never a default", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "");
    mockHeaders.set("authorization", basicAuthHeader("owner", "correct-horse-battery-staple"));

    await expect(requireMasterclassAdmin()).rejects.toBeInstanceOf(UnauthorizedAdminError);
  });

  it("rejects a request with no Authorization header", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "owner");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "correct-horse-battery-staple");

    await expect(requireMasterclassAdmin()).rejects.toBeInstanceOf(UnauthorizedAdminError);
  });

  it("rejects a malformed (non-Basic) Authorization header", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "owner");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "correct-horse-battery-staple");
    mockHeaders.set("authorization", "Bearer some-token");

    await expect(requireMasterclassAdmin()).rejects.toBeInstanceOf(UnauthorizedAdminError);
  });

  it("rejects the correct username with the wrong password", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "owner");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "correct-horse-battery-staple");
    mockHeaders.set("authorization", basicAuthHeader("owner", "wrong-password"));

    await expect(requireMasterclassAdmin()).rejects.toBeInstanceOf(UnauthorizedAdminError);
  });

  it("rejects the wrong username with the correct password", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "owner");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "correct-horse-battery-staple");
    mockHeaders.set("authorization", basicAuthHeader("attacker", "correct-horse-battery-staple"));

    await expect(requireMasterclassAdmin()).rejects.toBeInstanceOf(UnauthorizedAdminError);
  });

  it("rejects an Authorization header present but with no credentials configured — a header alone is never sufficient", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "");
    mockHeaders.set("authorization", "Basic " + Buffer.from(":").toString("base64"));

    await expect(requireMasterclassAdmin()).rejects.toBeInstanceOf(UnauthorizedAdminError);
  });

  it("resolves with the username when the credentials match exactly", async () => {
    vi.stubEnv("MASTERCLASS_ADMIN_USER", "owner");
    vi.stubEnv("MASTERCLASS_ADMIN_PASSWORD", "correct-horse-battery-staple");
    mockHeaders.set("authorization", basicAuthHeader("owner", "correct-horse-battery-staple"));

    await expect(requireMasterclassAdmin()).resolves.toBe("owner");
  });
});
