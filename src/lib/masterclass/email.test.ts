import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/*
 * The `resend` SDK is mocked — this tests what this project's own code does
 * with the sender/reply-to configuration and failure handling, not Resend's
 * network behavior.
 */
const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const { sendConfirmationEmail } = await import("@/lib/masterclass/email");

function baseInput() {
  return {
    toEmail: "student@example.com",
    studentName: "Rahim Uddin",
    registrationRef: "MC-2026-000001",
    amountBDT: 1499,
    method: "BKASH" as const,
    classDateLabel: "২ ও ৩ অক্টোবর ২০২৬",
  };
}

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sendConfirmationEmail — sender configuration", () => {
  it("sends from Masum <masum@masumdev.com> and sets the same address as Reply-To", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "masum@masumdev.com");

    const result = await sendConfirmationEmail(baseInput());

    expect(result).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const [call] = sendMock.mock.calls[0];
    expect(call.from).toBe("Masum <masum@masumdev.com>");
    expect(call.replyTo).toBe("masum@masumdev.com");
    expect(call.to).toBe("student@example.com");
  });

  it("handles RESEND_FROM_EMAIL already set to the pre-formatted 'Name <email>' form without double-wrapping it", async () => {
    // A real misconfiguration this suite caught: the spec's own "preferred" example
    // is the fully-formatted string, which is one setup mistake away from producing
    // `Masum <Masum <masum@masumdev.com>>` if the code assumed a bare address.
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "Masum <masum@masumdev.com>");

    await sendConfirmationEmail(baseInput());
    const [call] = sendMock.mock.calls[0];
    expect(call.from).toBe("Masum <masum@masumdev.com>");
    expect(call.replyTo).toBe("masum@masumdev.com");
  });

  it("fails safely with SENDER_NOT_CONFIGURED when RESEND_FROM_EMAIL is unset — never sends from a fallback address", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "");

    const result = await sendConfirmationEmail(baseInput());

    expect(result).toEqual({ ok: false, errorCode: "SENDER_NOT_CONFIGURED" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("fails safely with EMAIL_NOT_CONFIGURED when RESEND_API_KEY is unset, even if a sender is configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("RESEND_FROM_EMAIL", "masum@masumdev.com");

    const result = await sendConfirmationEmail(baseInput());

    expect(result).toEqual({ ok: false, errorCode: "EMAIL_NOT_CONFIGURED" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("Reply-To falls back to RESEND_FROM_EMAIL when RESEND_REPLY_TO_EMAIL is unset (the normal case)", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "masum@masumdev.com");
    vi.stubEnv("RESEND_REPLY_TO_EMAIL", "");

    await sendConfirmationEmail(baseInput());
    const [call] = sendMock.mock.calls[0];
    expect(call.replyTo).toBe("masum@masumdev.com");
  });

  it("Reply-To uses RESEND_REPLY_TO_EMAIL when explicitly set, without changing the From address", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "masum@masumdev.com");
    vi.stubEnv("RESEND_REPLY_TO_EMAIL", "support@masumdev.com");

    await sendConfirmationEmail(baseInput());
    const [call] = sendMock.mock.calls[0];
    expect(call.from).toBe("Masum <masum@masumdev.com>");
    expect(call.replyTo).toBe("support@masumdev.com");
  });

  it("extracts a bare address from a pre-formatted RESEND_REPLY_TO_EMAIL too", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "masum@masumdev.com");
    vi.stubEnv("RESEND_REPLY_TO_EMAIL", "Masum Support <support@masumdev.com>");

    await sendConfirmationEmail(baseInput());
    const [call] = sendMock.mock.calls[0];
    expect(call.replyTo).toBe("support@masumdev.com");
  });

  it("passes a deterministic per-registration Idempotency-Key so a retried send after a lost response can't duplicate the email", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "masum@masumdev.com");

    await sendConfirmationEmail(baseInput());
    const [, options] = sendMock.mock.calls[0];
    expect(options).toEqual({ idempotencyKey: "masterclass-confirmation-MC-2026-000001" });

    sendMock.mockClear();
    await sendConfirmationEmail(baseInput());
    const [, secondCallOptions] = sendMock.mock.calls[0];
    expect(secondCallOptions).toEqual(options); // same registration → same key, every time
  });

  it("never uses the old masterclass@masumdev.com address under any configuration", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "masum@masumdev.com");

    await sendConfirmationEmail(baseInput());

    const [call] = sendMock.mock.calls[0];
    expect(call.from).not.toContain("masterclass@masumdev.com");
    expect(call.replyTo).not.toContain("masterclass@masumdev.com");
  });
});

describe("sendConfirmationEmail — failure handling", () => {
  it("reports PROVIDER_ERROR without throwing when Resend returns an error", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "masum@masumdev.com");
    sendMock.mockResolvedValue({ data: null, error: { message: "domain not verified" } });

    const result = await sendConfirmationEmail(baseInput());
    expect(result).toEqual({ ok: false, errorCode: "PROVIDER_ERROR" });
  });

  it("reports NETWORK_ERROR without throwing when the send call rejects", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "masum@masumdev.com");
    sendMock.mockRejectedValue(new Error("fetch failed"));

    const result = await sendConfirmationEmail(baseInput());
    expect(result).toEqual({ ok: false, errorCode: "NETWORK_ERROR" });
  });
});
