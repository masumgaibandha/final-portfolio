import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DuplicateTransactionError } from "@/lib/masterclass/errors";
import type { PaymentOrderDocument } from "@/types/masterclass-persistence";

vi.mock("@/lib/env", () => ({ getSecurityEnv: vi.fn(), isRegistrationOperationallyReady: vi.fn() }));
vi.mock("@/lib/masterclass/origin-validation", () => ({ isRequestSameOrigin: vi.fn() }));
vi.mock("@/lib/masterclass/rate-limit", () => ({ checkRateLimit: vi.fn() }));
vi.mock("@/lib/masterclass/request-context", () => ({ extractClientIp: vi.fn() }));
vi.mock("@/lib/masterclass/payment-orders-repository", () => ({
  findOrderByPublicRef: vi.fn(),
  submitManualPayment: vi.fn(),
}));

const env = await import("@/lib/env");
const origin = await import("@/lib/masterclass/origin-validation");
const rateLimit = await import("@/lib/masterclass/rate-limit");
const requestContext = await import("@/lib/masterclass/request-context");
const repo = await import("@/lib/masterclass/payment-orders-repository");
const { POST } = await import("./route");

function buildOrder(overrides: Partial<PaymentOrderDocument> = {}): PaymentOrderDocument {
  const now = new Date();
  return {
    _id: new ObjectId(),
    publicOrderRef: "ord_test-order",
    registrationId: new ObjectId(),
    masterclassSlug: "lead-generation-cold-email",
    batchId: "lead-generation-cold-email-2026-10",
    amount: 1499,
    currency: "BDT",
    status: "PENDING",
    provider: "MANUAL",
    method: null,
    manualPayment: null,
    idempotencyKey: "11111111-1111-4111-8111-111111111111",
    requestFingerprint: "fp",
    providerTransactionId: null,
    providerPaymentId: null,
    attribution: { capturedAt: now },
    clientContext: { clientIpAddress: null, clientUserAgent: null },
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
    verifiedAt: null,
    verifiedBy: null,
    rejectedReason: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function postRequest(body: unknown) {
  return new NextRequest("https://masumdev.com/api/masterclass/registrations/ord_test-order/payment", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://masumdev.com" },
    body: JSON.stringify(body),
  });
}

function callRoute(body: unknown, publicOrderRef = "ord_test-order") {
  return POST(postRequest(body), { params: Promise.resolve({ publicOrderRef }) });
}

function stubHappyPathGates() {
  vi.mocked(env.isRegistrationOperationallyReady).mockReturnValue(true);
  vi.mocked(env.getSecurityEnv).mockReturnValue({
    turnstileSecretKey: "secret",
    rateLimitSecret: "rl-secret",
    allowedOrigins: ["https://masumdev.com"],
  });
  vi.mocked(origin.isRequestSameOrigin).mockReturnValue(true);
  vi.mocked(requestContext.extractClientIp).mockReturnValue("203.0.113.5");
  vi.mocked(rateLimit.checkRateLimit).mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/masterclass/registrations/[publicOrderRef]/payment", () => {
  it.each(["BKASH", "NAGAD", "ROCKET"] as const)("accepts a valid %s submission and returns REVIEW", async (method) => {
    stubHappyPathGates();
    vi.mocked(repo.findOrderByPublicRef).mockResolvedValue(buildOrder());
    vi.mocked(repo.submitManualPayment).mockResolvedValue(buildOrder({ status: "REVIEW", method }));

    const response = await callRoute({ method, senderNumber: "01712345678", transactionId: "TXID12345" });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ publicOrderRef: "ord_test-order", status: "REVIEW" });
  });

  it("returns 422 for an invalid payment method", async () => {
    stubHappyPathGates();
    vi.mocked(repo.findOrderByPublicRef).mockResolvedValue(buildOrder());

    const response = await callRoute({ method: "PAYPAL", senderNumber: "01712345678", transactionId: "TXID12345" });
    expect(response.status).toBe(422);
    expect(repo.submitManualPayment).not.toHaveBeenCalled();
  });

  it("returns 404 for an order that doesn't exist", async () => {
    stubHappyPathGates();
    vi.mocked(repo.findOrderByPublicRef).mockResolvedValue(null);

    const response = await callRoute(
      { method: "BKASH", senderNumber: "01712345678", transactionId: "TXID12345" },
      "ord_does-not-exist",
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: "ORDER_NOT_FOUND" });
  });

  it("returns 409 DUPLICATE_TRANSACTION_ID when the TxID is already recorded against another order", async () => {
    stubHappyPathGates();
    vi.mocked(repo.findOrderByPublicRef).mockResolvedValue(buildOrder());
    vi.mocked(repo.submitManualPayment).mockRejectedValue(new DuplicateTransactionError());

    const response = await callRoute({ method: "BKASH", senderNumber: "01712345678", transactionId: "ALREADY-USED" });
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({ error: "DUPLICATE_TRANSACTION_ID" });
  });

  it("returns 503 when registration/payment isn't operationally ready", async () => {
    vi.mocked(env.isRegistrationOperationallyReady).mockReturnValue(false);
    vi.mocked(env.getSecurityEnv).mockReturnValue(null);

    const response = await callRoute({ method: "BKASH", senderNumber: "01712345678", transactionId: "TXID12345" });
    expect(response.status).toBe(503);
    expect(repo.findOrderByPublicRef).not.toHaveBeenCalled();
  });
});
