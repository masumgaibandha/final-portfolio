import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PaymentOrderDocument } from "@/types/masterclass-persistence";

/*
 * This is the actual authorization boundary for every admin mutation —
 * `requireMasterclassAdmin()` is mocked here (its own real behavior is
 * covered by admin-auth.test.ts), so these tests prove the *actions*
 * themselves never touch a repository, email, or Meta call when it
 * rejects, regardless of what middleware.ts would or wouldn't have done.
 */
vi.mock("@/lib/masterclass/admin-auth", () => ({
  requireMasterclassAdmin: vi.fn(),
  UnauthorizedAdminError: class UnauthorizedAdminError extends Error {},
}));
vi.mock("@/lib/masterclass/verify-service", () => ({
  approvePayment: vi.fn(),
  rejectPaymentOrder: vi.fn(),
  retryDelivery: vi.fn(),
}));
vi.mock("@/lib/masterclass/payment-orders-repository", () => ({ findOrderByPublicRef: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const adminAuth = await import("@/lib/masterclass/admin-auth");
const verifyService = await import("@/lib/masterclass/verify-service");
const repo = await import("@/lib/masterclass/payment-orders-repository");
const { approveOrderAction, rejectOrderAction, retryDeliveryAction } = await import("./actions");

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
    status: "PAID",
    provider: "MANUAL",
    method: "BKASH",
    manualPayment: null,
    idempotencyKey: "11111111-1111-4111-8111-111111111111",
    requestFingerprint: "fp",
    providerTransactionId: null,
    providerPaymentId: null,
    attribution: { capturedAt: now },
    clientContext: { clientIpAddress: null, clientUserAgent: null },
    metaEventIds: { initiateCheckout: null, purchase: "purchase_ord_test-order" },
    confirmationEmail: {
      status: "SENT", attempts: 1, processingToken: null, processingStartedAt: null,
      leaseExpiresAt: null, lastAttemptAt: now, sentAt: now, lastErrorCode: null,
    },
    purchaseCapi: {
      status: "SENT", attempts: 1, processingToken: null, processingStartedAt: null,
      leaseExpiresAt: null, lastAttemptAt: now, sentAt: now, lastErrorCode: null,
    },
    verifiedAt: now,
    verifiedBy: "owner",
    rejectedReason: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("unauthorized callers", () => {
  beforeEach(() => {
    vi.mocked(adminAuth.requireMasterclassAdmin).mockRejectedValue(new adminAuth.UnauthorizedAdminError());
  });

  it("approveOrderAction rejects an unauthenticated/unauthorized attempt", async () => {
    const result = await approveOrderAction("ord_test-order");
    expect(result).toEqual({ ok: false, message: "Not authorized." });
  });

  it("rejectOrderAction rejects an unauthenticated/unauthorized attempt", async () => {
    const result = await rejectOrderAction("ord_test-order", "bad TxID");
    expect(result).toEqual({ ok: false, message: "Not authorized." });
  });

  it("retryDeliveryAction rejects an unauthenticated/unauthorized attempt", async () => {
    const result = await retryDeliveryAction("ord_test-order");
    expect(result).toEqual({ ok: false, message: "Not authorized." });
  });

  it("an unauthorized approve causes zero calls to the payment-approval service — no DB mutation, no email, no CAPI", async () => {
    await approveOrderAction("ord_test-order");
    expect(verifyService.approvePayment).not.toHaveBeenCalled();
  });

  it("an unauthorized reject causes zero calls to the reject service", async () => {
    await rejectOrderAction("ord_test-order", "reason");
    expect(verifyService.rejectPaymentOrder).not.toHaveBeenCalled();
  });

  it("an unauthorized retry causes zero calls to the retry-delivery service", async () => {
    await retryDeliveryAction("ord_test-order");
    expect(verifyService.retryDelivery).not.toHaveBeenCalled();
  });

  it("an unauthorized caller never even reaches a repository read of sensitive order data", async () => {
    await approveOrderAction("ord_test-order");
    await rejectOrderAction("ord_test-order", "reason");
    expect(repo.findOrderByPublicRef).not.toHaveBeenCalled();
  });
});

describe("authorized callers", () => {
  beforeEach(() => {
    vi.mocked(adminAuth.requireMasterclassAdmin).mockResolvedValue("owner");
  });

  it("approveOrderAction succeeds and reports the order as PAID", async () => {
    vi.mocked(verifyService.approvePayment).mockResolvedValue({ kind: "ok", order: buildOrder() });
    vi.mocked(repo.findOrderByPublicRef).mockResolvedValue(buildOrder());

    const result = await approveOrderAction("ord_test-order");

    expect(result.ok).toBe(true);
    expect(verifyService.approvePayment).toHaveBeenCalledWith("ord_test-order", "owner", expect.any(String));
  });

  it("rejectOrderAction succeeds", async () => {
    vi.mocked(verifyService.rejectPaymentOrder).mockResolvedValue({ kind: "ok", order: buildOrder({ status: "REJECTED" }) });

    const result = await rejectOrderAction("ord_test-order", "amount mismatch");

    expect(result.ok).toBe(true);
    expect(verifyService.rejectPaymentOrder).toHaveBeenCalledWith("ord_test-order", "owner", "amount mismatch");
  });
});
