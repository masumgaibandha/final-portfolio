import type { ObjectId } from "mongodb";

/**
 * MongoDB document shapes for the masterclass funnel. Kept separate from
 * `src/types/masterclass.ts` (UI-content types like `FaqItem`/`ProofAsset`)
 * so a database schema change is never mistaken for a copy change.
 */

export type RegistrationStatus = "PENDING_PAYMENT" | "ENROLLED" | "CANCELLED";

export type PaymentOrderStatus =
  | "CREATED"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REVIEW"
  | "REFUNDED";

/** No gateway is wired yet — every order is created `UNASSIGNED`. */
export type PaymentProvider = "UNASSIGNED" | "PORTPOS" | "SHURJOPAY" | "SSLCOMMERZ";

/**
 * Whitelisted attribution only — never an arbitrary object. `capturedAt` is
 * server-set, not client-submitted, so it can't be backdated or forged.
 */
export interface AttributionSnapshot {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  landingPage?: string;
  referrer?: string;
  capturedAt: Date;
}

export type DeliveryStatus = "NOT_READY" | "READY" | "PROCESSING" | "SENT" | "FAILED";

/**
 * Shared shape for both async delivery side effects (`confirmationEmail`,
 * `purchaseCapi`) on a payment order. No sender code exists yet — this only
 * defines the state machine a future worker will drive.
 *
 * Intended lifecycle (not implemented in this phase):
 * - New draft orders start `NOT_READY` (nothing to send — the order isn't
 *   paid). A future payment-confirmation step moves eligible orders to
 *   `READY`.
 * - A worker claims one unit of work with a single atomic
 *   `findOneAndUpdate` that matches any of three cases — the lease-expiry
 *   check applies only to the third, `PROCESSING`, case, not to `FAILED`:
 *     1. `status: "READY"` — never attempted.
 *     2. `status: "FAILED"` AND `attempts` below a retry ceiling — the
 *        previous attempt errored and the record is eligible to be tried
 *        again immediately; `FAILED` never holds a lease.
 *     3. `status: "PROCESSING"` AND `leaseExpiresAt < now` — a previous
 *        claimant crashed or stalled mid-attempt without ever reaching
 *        `SENT` or `FAILED`, and its lease has since expired.
 *   Any of the three moves the record to `status: "PROCESSING"` with a
 *   fresh `processingToken`, `processingStartedAt: now`, and a new
 *   `leaseExpiresAt` a short duration out. The matched-and-updated document
 *   is theirs; anyone who doesn't win that update tries something else.
 * - On success: `status: "SENT"`, `sentAt: now`. `SENT` is terminal — none
 *   of the three claim cases above ever matches a `SENT` record, so a
 *   worker can never re-claim or resend one.
 * - On failure: `status: "FAILED"`, `attempts += 1`, `lastAttemptAt: now`,
 *   `lastErrorCode` set to a short allowlisted code (never the raw
 *   provider/email error) — immediately eligible for case 2 above, no lease
 *   wait required.
 * - A crashed worker can never permanently strand a record: it sits in
 *   `PROCESSING` only until `leaseExpiresAt` passes, at which point case 3
 *   makes it claimable again.
 */
export interface DeliveryState {
  status: DeliveryStatus;
  attempts: number;
  /** Opaque token the current claimant holds; lets a worker recognize its own lease. Null when not claimed. */
  processingToken: string | null;
  processingStartedAt: Date | null;
  /** Once passed, a `PROCESSING` record becomes claimable again. Null when not claimed. */
  leaseExpiresAt: Date | null;
  lastAttemptAt: Date | null;
  sentAt: Date | null;
  /** Short allowlisted code only (e.g. "PROVIDER_TIMEOUT") — never a raw exception message. */
  lastErrorCode: string | null;
}

/**
 * Evidence of what a student agreed to and exactly which version of each
 * document was in effect at that moment — added Phase 3A, no migration
 * needed (no production registrations exist yet). `privacyPolicyVersion`,
 * `termsVersion`, and `refundPolicyVersion` are always stamped from
 * `policyVersions` in `src/lib/masterclass/constants.ts` at write time —
 * never accepted from the client, and never rewritten by a later retry (see
 * `upsertRegistration`'s doc comment). Never returned by the public API.
 */
export interface ConsentRecord {
  /** Always `true` — a registration document is only ever created after `termsAccepted === true` was explicitly submitted; there is no way to persist `false`. */
  accepted: true;
  privacyPolicyVersion: string;
  termsVersion: string;
  refundPolicyVersion: string;
  acceptedAt: Date;
  /** Always a separate, explicit opt-in, independent of `accepted`. Defaults to false, never true by inference. */
  marketingConsent: boolean;
}

/**
 * One document per student per batch — `(batchId, emailNormalized)` is
 * unique. A retried or repeated submission updates this document rather than
 * creating a duplicate; `firstTouchAttribution` never changes after the
 * first write, `lastTouchAttribution` does.
 */
export interface RegistrationDocument {
  _id?: ObjectId;
  /** Public, unguessable identifier — the `_id` is never exposed outside the database layer. */
  publicRegistrationRef: string;
  masterclassSlug: string;
  batchId: string;
  name: string;
  /** As submitted (trimmed) — display form. Uniqueness is enforced on `emailNormalized`. */
  email: string;
  emailNormalized: string;
  /** As submitted (trimmed) — display form. */
  phone: string;
  /** Normalized to +8801XXXXXXXXX — the form used everywhere else (payment, email). */
  phoneE164: string;
  status: RegistrationStatus;
  consent: ConsentRecord;
  firstTouchAttribution: AttributionSnapshot;
  lastTouchAttribution: AttributionSnapshot;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * One document per checkout/payment attempt. Never trust `status` alone as
 * proof of payment when a gateway is wired up later — only a verified
 * provider response may set it to `PAID`.
 */
export interface PaymentOrderDocument {
  _id?: ObjectId;
  /** Public, unguessable identifier — the `_id` is never exposed outside the database layer. */
  publicOrderRef: string;
  registrationId: ObjectId;
  masterclassSlug: string;
  batchId: string;
  amount: number;
  currency: string;
  status: PaymentOrderStatus;
  provider: PaymentProvider;
  /** Client-supplied UUID (the `Idempotency-Key` header) — a repeat within the same batch returns the existing order, but only if `requestFingerprint` also matches. */
  idempotencyKey: string;
  /** SHA-256 of the canonical (batchId, registrationId, amount, currency) tuple — see `src/lib/masterclass/fingerprint.ts`. A key reused for a different request is a conflict, not a replay. */
  requestFingerprint: string;
  providerTransactionId: string | null;
  providerPaymentId: string | null;
  attribution: AttributionSnapshot;
  /** Server-derived only — never taken from the request body. Reserved for future Meta CAPI use. */
  clientContext: {
    clientIpAddress: string | null;
    clientUserAgent: string | null;
  };
  metaEventIds: {
    initiateCheckout: string | null;
    /** Deterministic (`purchase_${publicOrderRef}`) and known at creation, so a later retry can never mint a second Purchase event id for the same order. */
    purchase: string;
  };
  confirmationEmail: DeliveryState;
  purchaseCapi: DeliveryState;
  createdAt: Date;
  updatedAt: Date;
}
