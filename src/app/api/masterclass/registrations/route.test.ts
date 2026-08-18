import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

/*
 * Route-level contract tests: every collaborator is mocked, so this proves
 * the route's own branching (status codes, gate ordering) rather than any
 * collaborator's internals — those are covered in their own test files
 * (validation.test.ts, verify-service.test.ts, etc.) or, where they need a
 * live MongoDB/Turnstile/Resend/Meta call, are out of this project's
 * automated-test scope (see the implementation plan).
 */

vi.mock("@/lib/env", () => ({
  getSecurityEnv: vi.fn(),
  isRegistrationEnabled: vi.fn(),
}));
vi.mock("@/lib/masterclass/constants", () => ({ isPrivacyPolicyPublished: vi.fn() }));
vi.mock("@/lib/masterclass/origin-validation", () => ({ isRequestSameOrigin: vi.fn() }));
vi.mock("@/lib/masterclass/rate-limit", () => ({ checkRateLimit: vi.fn() }));
vi.mock("@/lib/masterclass/registration-service", () => ({ registerForMasterclass: vi.fn() }));
vi.mock("@/lib/masterclass/request-context", () => ({
  extractClientIp: vi.fn(),
  extractClientUserAgent: vi.fn(),
}));
vi.mock("@/lib/masterclass/turnstile", () => ({
  getAllowedTurnstileHostnames: vi.fn(() => ["masumdev.com"]),
  validateTurnstileToken: vi.fn(),
}));

const env = await import("@/lib/env");
const constants = await import("@/lib/masterclass/constants");
const origin = await import("@/lib/masterclass/origin-validation");
const rateLimit = await import("@/lib/masterclass/rate-limit");
const registrationService = await import("@/lib/masterclass/registration-service");
const requestContext = await import("@/lib/masterclass/request-context");
const turnstile = await import("@/lib/masterclass/turnstile");
const { POST } = await import("./route");

function validRegistrationBody() {
  return {
    name: "Rahim Uddin",
    email: "rahim@example.com",
    phone: "01712345678",
    termsAccepted: true,
    marketingConsent: false,
    turnstileToken: "valid-token",
  };
}

function postRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://masumdev.com/api/masterclass/registrations", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "idempotency-key": "11111111-1111-4111-8111-111111111111",
      origin: "https://masumdev.com",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

/** Wires every gate to "pass" — individual tests override just what they're testing. */
function stubHappyPathGates() {
  vi.mocked(env.isRegistrationEnabled).mockReturnValue(true);
  vi.mocked(env.getSecurityEnv).mockReturnValue({
    turnstileSecretKey: "secret",
    rateLimitSecret: "rl-secret",
    allowedOrigins: ["https://masumdev.com"],
  });
  vi.mocked(constants.isPrivacyPolicyPublished).mockReturnValue(true);
  vi.mocked(origin.isRequestSameOrigin).mockReturnValue(true);
  vi.mocked(requestContext.extractClientIp).mockReturnValue("203.0.113.5");
  vi.mocked(requestContext.extractClientUserAgent).mockReturnValue("test-agent");
  vi.mocked(rateLimit.checkRateLimit).mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
  vi.mocked(turnstile.validateTurnstileToken).mockResolvedValue({ ok: true });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/masterclass/registrations", () => {
  it("returns 503 REGISTRATION_NOT_OPEN when registration is disabled — before touching anything else", async () => {
    vi.mocked(env.isRegistrationEnabled).mockReturnValue(false);
    vi.mocked(env.getSecurityEnv).mockReturnValue(null);

    const response = await POST(postRequest(validRegistrationBody()));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({ error: "REGISTRATION_NOT_OPEN" });
    expect(registrationService.registerForMasterclass).not.toHaveBeenCalled();
  });

  it("returns 201 with the human-friendly registration ref on a valid registration", async () => {
    stubHappyPathGates();
    vi.mocked(registrationService.registerForMasterclass).mockResolvedValue({
      kind: "ok",
      publicRegistrationRef: "MC-2026-000001",
      publicOrderRef: "ord_abc123",
      status: "PENDING",
    });

    const response = await POST(postRequest(validRegistrationBody()));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      publicRegistrationRef: "MC-2026-000001",
      publicOrderRef: "ord_abc123",
      status: "PENDING",
    });
  });

  it("returns 409 REGISTRATION_CONFLICT for a duplicate registration (same email, different phone)", async () => {
    stubHappyPathGates();
    vi.mocked(registrationService.registerForMasterclass).mockResolvedValue({ kind: "registration_conflict" });

    const response = await POST(postRequest(validRegistrationBody()));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({ error: "REGISTRATION_CONFLICT" });
  });

  it("returns 422 VALIDATION_ERROR for an invalid email, without ever calling the service layer", async () => {
    stubHappyPathGates();

    const response = await POST(postRequest({ ...validRegistrationBody(), email: "not-an-email" }));

    expect(response.status).toBe(422);
    expect(registrationService.registerForMasterclass).not.toHaveBeenCalled();
  });
});
