import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PaymentOrderDocument, RegistrationDocument } from "@/types/masterclass-persistence";

/*
 * Every dependency of verify-service.ts is mocked — no MongoDB, no real
 * email, no real Meta call. This tests the *orchestration* (which side
 * effects fire, in what order, and whether a failure in one ever touches
 * `status`), which is exactly the business-critical logic this file exists
 * for. `payment-orders-repository.ts`'s own atomic `REVIEW`-guarded
 * `findOneAndUpdate` (the actual double-processing protection) needs a live
 * Mongo instance to verify for real — that's out of scope here; see the
 * implementation plan.
 */

vi.mock("@/lib/masterclass/payment-orders-repository", () => ({
  verifyPayment: vi.fn(),
  rejectPayment: vi.fn(),
  findOrderByPublicRef: vi.fn(),
  updateDeliveryState: vi.fn(),
}));
vi.mock("@/lib/masterclass/registrations-repository", () => ({
  findRegistrationById: vi.fn(),
  markRegistrationEnrolled: vi.fn(),
}));
vi.mock("@/lib/masterclass/email", () => ({ sendConfirmationEmail: vi.fn() }));
vi.mock("@/lib/masterclass/meta-capi", () => ({ sendPurchaseEvent: vi.fn() }));
vi.mock("@/lib/env", () => ({ getMetaCapiEnv: vi.fn() }));

const repo = await import("@/lib/masterclass/payment-orders-repository");
const registrations = await import("@/lib/masterclass/registrations-repository");
const email = await import("@/lib/masterclass/email");
const capi = await import("@/lib/masterclass/meta-capi");
const env = await import("@/lib/env");
const { approvePayment, rejectPaymentOrder } = await import("@/lib/masterclass/verify-service");

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
    verifiedAt: now,
    verifiedBy: "operator",
    rejectedReason: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function buildRegistration(overrides: Partial<RegistrationDocument> = {}): RegistrationDocument {
  const now = new Date("2026-08-20T12:00:00Z");
  return {
    _id: new ObjectId(),
    publicRegistrationRef: "MC-2026-000001",
    masterclassSlug: "lead-generation-cold-email",
    batchId: "lead-generation-cold-email-2026-10",
    name: "Rahim Uddin",
    email: "rahim@example.com",
    emailNormalized: "rahim@example.com",
    phone: "01712345678",
    phoneE164: "+8801712345678",
    status: "PENDING_PAYMENT",
    consent: {
      accepted: true,
      privacyPolicyVersion: "2026-08-18",
      termsVersion: "2026-08-09",
      refundPolicyVersion: "2026-08-09",
      acceptedAt: now,
      marketingConsent: false,
    },
    firstTouchAttribution: { capturedAt: now },
    lastTouchAttribution: { capturedAt: now },
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("approvePayment — REVIEW → PAID", () => {
  it("enrolls the registration and sends both confirmation email and Meta CAPI Purchase exactly once", async () => {
    const order = buildOrder();
    const registration = buildRegistration();

    vi.mocked(repo.verifyPayment).mockResolvedValue(order);
    vi.mocked(registrations.findRegistrationById).mockResolvedValue(registration);
    vi.mocked(env.getMetaCapiEnv).mockReturnValue({ pixelId: "123", capiAccessToken: "token" });
    vi.mocked(email.sendConfirmationEmail).mockResolvedValue({ ok: true });
    vi.mocked(capi.sendPurchaseEvent).mockResolvedValue({ ok: true });

    const result = await approvePayment("ord_test-order", "operator", "https://masumdev.com/masterclass/lead-generation-cold-email");

    expect(result.kind).toBe("ok");
    expect(registrations.markRegistrationEnrolled).toHaveBeenCalledWith(order.registrationId);
    expect(email.sendConfirmationEmail).toHaveBeenCalledTimes(1);
    expect(capi.sendPurchaseEvent).toHaveBeenCalledTimes(1);
    expect(repo.updateDeliveryState).toHaveBeenCalledWith("ord_test-order", "confirmationEmail", { ok: true });
    expect(repo.updateDeliveryState).toHaveBeenCalledWith("ord_test-order", "purchaseCapi", { ok: true });
  });

  it("an already-processed order (not REVIEW) is reported without re-running any side effect", async () => {
    vi.mocked(repo.verifyPayment).mockResolvedValue(null); // atomic guard matched nothing — already PAID/REJECTED
    vi.mocked(repo.findOrderByPublicRef).mockResolvedValue(buildOrder());

    const result = await approvePayment("ord_test-order", "operator", "https://masumdev.com/masterclass/lead-generation-cold-email");

    expect(result.kind).toBe("already_processed");
    expect(registrations.markRegistrationEnrolled).not.toHaveBeenCalled();
    expect(email.sendConfirmationEmail).not.toHaveBeenCalled();
    expect(capi.sendPurchaseEvent).not.toHaveBeenCalled();
  });

  it("reports not_found for an order that never existed", async () => {
    vi.mocked(repo.verifyPayment).mockResolvedValue(null);
    vi.mocked(repo.findOrderByPublicRef).mockResolvedValue(null);

    const result = await approvePayment("ord_missing", "operator", "https://masumdev.com/masterclass/lead-generation-cold-email");
    expect(result.kind).toBe("not_found");
  });

  it("a confirmation-email failure is recorded but never rolls back PAID or blocks the Meta CAPI attempt", async () => {
    const order = buildOrder();
    vi.mocked(repo.verifyPayment).mockResolvedValue(order);
    vi.mocked(registrations.findRegistrationById).mockResolvedValue(buildRegistration());
    vi.mocked(env.getMetaCapiEnv).mockReturnValue({ pixelId: "123", capiAccessToken: "token" });
    vi.mocked(email.sendConfirmationEmail).mockResolvedValue({ ok: false, errorCode: "PROVIDER_ERROR" });
    vi.mocked(capi.sendPurchaseEvent).mockResolvedValue({ ok: true });

    const result = await approvePayment("ord_test-order", "operator", "https://masumdev.com/masterclass/lead-generation-cold-email");

    expect(result.kind).toBe("ok"); // PAID stands regardless of the email outcome
    expect(repo.updateDeliveryState).toHaveBeenCalledWith("ord_test-order", "confirmationEmail", {
      ok: false,
      errorCode: "PROVIDER_ERROR",
    });
  });

  it("records CAPI_NOT_CONFIGURED (never crashes) when Meta env vars are unset", async () => {
    const order = buildOrder();
    vi.mocked(repo.verifyPayment).mockResolvedValue(order);
    vi.mocked(registrations.findRegistrationById).mockResolvedValue(buildRegistration());
    vi.mocked(env.getMetaCapiEnv).mockReturnValue(null);
    vi.mocked(email.sendConfirmationEmail).mockResolvedValue({ ok: true });

    const result = await approvePayment("ord_test-order", "operator", "https://masumdev.com/masterclass/lead-generation-cold-email");

    expect(result.kind).toBe("ok");
    expect(capi.sendPurchaseEvent).not.toHaveBeenCalled();
    expect(repo.updateDeliveryState).toHaveBeenCalledWith("ord_test-order", "purchaseCapi", {
      ok: false,
      errorCode: "CAPI_NOT_CONFIGURED",
    });
  });
});

describe("rejectPaymentOrder — REVIEW → REJECTED", () => {
  it("never sends a confirmation email or a Meta Purchase event", async () => {
    vi.mocked(repo.rejectPayment).mockResolvedValue(buildOrder({ status: "REJECTED" }));

    const result = await rejectPaymentOrder("ord_test-order", "operator", "Amount does not match");

    expect(result.kind).toBe("ok");
    expect(email.sendConfirmationEmail).not.toHaveBeenCalled();
    expect(capi.sendPurchaseEvent).not.toHaveBeenCalled();
  });

  it("an already-processed order is reported, not silently re-rejected", async () => {
    vi.mocked(repo.rejectPayment).mockResolvedValue(null);
    vi.mocked(repo.findOrderByPublicRef).mockResolvedValue(buildOrder({ status: "PAID" }));

    const result = await rejectPaymentOrder("ord_test-order", "operator", null);
    expect(result.kind).toBe("already_processed");
  });
});
