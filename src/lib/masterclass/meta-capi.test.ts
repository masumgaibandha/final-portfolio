import { ObjectId } from "mongodb";
import { afterEach, describe, expect, it, vi } from "vitest";

import { sendPurchaseEvent } from "@/lib/masterclass/meta-capi";
import type { PaymentOrderDocument } from "@/types/masterclass-persistence";

function buildOrder(overrides: Partial<PaymentOrderDocument> = {}): PaymentOrderDocument {
  const now = new Date("2026-08-20T12:00:00Z");
  return {
    _id: new ObjectId(),
    publicOrderRef: "ord_test-order",
    registrationId: new ObjectId(),
    masterclassSlug: "lead-generation-cold-email",
    batchId: "lead-generation-cold-email-2026-10",
    amount: 1499,
    currency: "BDT",
    status: "PAID",
    provider: "MANUAL",
    method: "BKASH",
    manualPayment: {
      senderNumber: "+8801712345678",
      transactionIdRaw: "9G7H2K1XYZ",
      transactionIdNormalized: "9G7H2K1XYZ",
      submittedAt: now,
    },
    idempotencyKey: "11111111-1111-4111-8111-111111111111",
    requestFingerprint: "fingerprint",
    providerTransactionId: null,
    providerPaymentId: null,
    attribution: { capturedAt: now, fbp: "fb.1.111.222", fbc: "fb.1.111.333" },
    clientContext: { clientIpAddress: "203.0.113.5", clientUserAgent: "test-agent" },
    metaEventIds: { initiateCheckout: null, purchase: "purchase_ord_test-order" },
    confirmationEmail: {
      status: "NOT_READY",
      attempts: 0,
      processingToken: null,
      processingStartedAt: null,
      leaseExpiresAt: null,
      lastAttemptAt: null,
      sentAt: null,
      lastErrorCode: null,
    },
    purchaseCapi: {
      status: "NOT_READY",
      attempts: 0,
      processingToken: null,
      processingStartedAt: null,
      leaseExpiresAt: null,
      lastAttemptAt: null,
      sentAt: null,
      lastErrorCode: null,
    },
    verifiedAt: now,
    verifiedBy: "operator",
    rejectedReason: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("sendPurchaseEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends currency BDT, the order's actual amount, and a deterministic event_id — never raw email/phone", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    const order = buildOrder({ amount: 1499, currency: "BDT" });
    const result = await sendPurchaseEvent({
      order,
      emailNormalized: "student@example.com",
      phoneE164: "+8801712345678",
      attribution: order.attribution,
      eventSourceUrl: "https://masumdev.com/masterclass/lead-generation-cold-email",
      pixelId: "1234567890",
      accessToken: "test-access-token",
    });

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/1234567890/events");
    expect(url).toContain("access_token=test-access-token");

    const body = JSON.parse(init.body as string);
    const event = body.data[0];

    expect(event.event_name).toBe("Purchase");
    expect(event.action_source).toBe("website");
    expect(event.event_id).toBe("purchase_ord_test-order"); // the order's pre-computed deterministic id — dedup-ready
    expect(event.custom_data.currency).toBe("BDT");
    expect(event.custom_data.value).toBe(1499); // the order's actual stored amount, not a re-derived "current price"

    const rawText = JSON.stringify(body);
    expect(rawText).not.toContain("student@example.com");
    expect(rawText).not.toContain("+8801712345678");
    expect(event.user_data.em[0]).toMatch(/^[0-9a-f]{64}$/); // sha256 hex digest, not plaintext
    expect(event.user_data.ph[0]).toMatch(/^[0-9a-f]{64}$/);
  });

  it("uses the order's actual amount, not the current masterclass price, when they differ (a historical order at the old price)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    const order = buildOrder({ amount: 1999 }); // e.g. registered after early-bird ended
    await sendPurchaseEvent({
      order,
      emailNormalized: "student@example.com",
      phoneE164: "+8801712345678",
      attribution: null,
      eventSourceUrl: "https://masumdev.com/masterclass/lead-generation-cold-email",
      pixelId: "1234567890",
      accessToken: "test-access-token",
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.data[0].custom_data.value).toBe(1999);
  });

  it("reports a failure code without throwing when Meta returns a non-OK response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({}) }));

    const result = await sendPurchaseEvent({
      order: buildOrder(),
      emailNormalized: "student@example.com",
      phoneE164: "+8801712345678",
      attribution: null,
      eventSourceUrl: "https://masumdev.com/masterclass/lead-generation-cold-email",
      pixelId: "1234567890",
      accessToken: "bad-token",
    });

    expect(result).toEqual({ ok: false, errorCode: "HTTP_400" });
  });
});
