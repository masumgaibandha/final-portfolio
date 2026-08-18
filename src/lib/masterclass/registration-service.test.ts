import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { IdempotencyConflictError, RegistrationConflictError } from "@/lib/masterclass/errors";
import type { RegistrationInput } from "@/lib/masterclass/validation";

/*
 * The MongoDB session/transaction machinery is mocked to just invoke the
 * callback directly — this tests `registerForMasterclass`'s own
 * orchestration (what it passes to each repository, and how it maps
 * thrown errors to result kinds), not a real Atlas transaction.
 */
vi.mock("@/lib/mongodb", () => ({
  getClient: vi.fn().mockResolvedValue({
    startSession: () => ({
      withTransaction: async (fn: () => Promise<void>) => fn(),
      endSession: vi.fn(),
    }),
  }),
}));
vi.mock("@/lib/masterclass/registrations-repository", () => ({ upsertRegistration: vi.fn() }));
vi.mock("@/lib/masterclass/payment-orders-repository", () => ({ createDraftOrder: vi.fn() }));

const registrations = await import("@/lib/masterclass/registrations-repository");
const orders = await import("@/lib/masterclass/payment-orders-repository");
const { registerForMasterclass } = await import("@/lib/masterclass/registration-service");

function baseParams() {
  const input: RegistrationInput = {
    name: "Rahim Uddin",
    email: "rahim@example.com",
    phone: "01712345678",
    termsAccepted: true,
    marketingConsent: false,
    turnstileToken: "token",
    attribution: { utmSource: "facebook", utmMedium: "cpc", fbclid: "IwAR123" },
  };
  return {
    input,
    emailNormalized: "rahim@example.com",
    phoneE164: "+8801712345678",
    idempotencyKey: "11111111-1111-4111-8111-111111111111",
    clientIpAddress: "203.0.113.5",
    clientUserAgent: "test-agent",
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerForMasterclass — attribution", () => {
  it("passes the submitted UTM/fbclid attribution through to the registration write, unmodified", async () => {
    const registrationId = new ObjectId();
    vi.mocked(registrations.upsertRegistration).mockResolvedValue({
      _id: registrationId,
      publicRegistrationRef: "MC-2026-000001",
    } as never);
    vi.mocked(orders.createDraftOrder).mockResolvedValue({
      order: { publicOrderRef: "ord_abc123", status: "PENDING" },
      wasExisting: false,
    } as never);

    await registerForMasterclass(baseParams());

    expect(registrations.upsertRegistration).toHaveBeenCalledTimes(1);
    const [registrationInput] = vi.mocked(registrations.upsertRegistration).mock.calls[0];
    expect(registrationInput.attribution).toMatchObject({
      utmSource: "facebook",
      utmMedium: "cpc",
      fbclid: "IwAR123",
    });
    expect(registrationInput.attribution.capturedAt).toBeInstanceOf(Date); // server-stamped, not client-submitted

    const [orderInput] = vi.mocked(orders.createDraftOrder).mock.calls[0];
    expect(orderInput.attribution).toEqual(registrationInput.attribution); // same snapshot on both documents
  });
});

describe("registerForMasterclass — conflict mapping", () => {
  it("maps a thrown RegistrationConflictError to kind: registration_conflict, not a 500", async () => {
    vi.mocked(registrations.upsertRegistration).mockRejectedValue(new RegistrationConflictError());

    const result = await registerForMasterclass(baseParams());
    expect(result).toEqual({ kind: "registration_conflict" });
  });

  it("maps a thrown IdempotencyConflictError to kind: idempotency_conflict", async () => {
    vi.mocked(registrations.upsertRegistration).mockResolvedValue({
      _id: new ObjectId(),
      publicRegistrationRef: "MC-2026-000001",
    } as never);
    vi.mocked(orders.createDraftOrder).mockRejectedValue(new IdempotencyConflictError());

    const result = await registerForMasterclass(baseParams());
    expect(result).toEqual({ kind: "idempotency_conflict" });
  });
});
