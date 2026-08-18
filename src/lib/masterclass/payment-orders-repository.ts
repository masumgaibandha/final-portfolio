import type { ClientSession, Collection, ObjectId } from "mongodb";

import {
  DuplicateTransactionError,
  IdempotencyConflictError,
  OrderNotEditableError,
} from "@/lib/masterclass/errors";
import { computeOrderFingerprint } from "@/lib/masterclass/fingerprint";
import { getDb } from "@/lib/mongodb";
import { generatePublicOrderRef } from "@/lib/masterclass/refs";
import type {
  AttributionSnapshot,
  DeliveryState,
  ManualPaymentMethod,
  PaymentOrderDocument,
} from "@/types/masterclass-persistence";

export const PAYMENT_ORDERS_COLLECTION = "payment_orders";

let indexesEnsured: Promise<void> | undefined;

async function ensureIndexes(
  collection: Collection<PaymentOrderDocument>,
): Promise<void> {
  indexesEnsured ??= (async () => {
    await Promise.all([
      collection.createIndex(
        { publicOrderRef: 1 },
        { unique: true, name: "uniq_public_order_ref" },
      ),
      collection.createIndex(
        { batchId: 1, idempotencyKey: 1 },
        { unique: true, name: "uniq_batch_idempotency_key" },
      ),
      collection.createIndex(
        { registrationId: 1, createdAt: 1 },
        { name: "registration_created" },
      ),
      collection.createIndex(
        { status: 1, updatedAt: 1 },
        { name: "status_updated" },
      ),
      /*
       * Partial index: only enforced once a gateway assigns a real
       * transaction id. Every `CREATED`/`UNASSIGNED` draft order has
       * `providerTransactionId: null`, so a plain unique index would collide
       * on the first two drafts ever created.
       */
      collection.createIndex(
        { provider: 1, providerTransactionId: 1 },
        {
          unique: true,
          name: "uniq_provider_transaction",
          partialFilterExpression: { providerTransactionId: { $type: "string" } },
        },
      ),
      /*
       * Same partial-index shape, for manual (bKash/Nagad/Rocket) payments:
       * a normalized transaction ID can only ever belong to one order. Every
       * order starts with `manualPayment: null`, so this only activates once
       * a student actually submits one.
       */
      collection.createIndex(
        { "manualPayment.transactionIdNormalized": 1 },
        {
          unique: true,
          name: "uniq_manual_transaction_id",
          partialFilterExpression: {
            "manualPayment.transactionIdNormalized": { $type: "string" },
          },
        },
      ),
      /* Powers the admin REVIEW queue — oldest-first, paginated. */
      collection.createIndex(
        { status: 1, createdAt: 1 },
        { name: "status_created" },
      ),
    ]);
  })();
  return indexesEnsured;
}

async function getCollection(): Promise<Collection<PaymentOrderDocument>> {
  const db = await getDb();
  const collection = db.collection<PaymentOrderDocument>(PAYMENT_ORDERS_COLLECTION);
  await ensureIndexes(collection);
  return collection;
}

export interface CreateDraftOrderInput {
  registrationId: ObjectId;
  masterclassSlug: string;
  batchId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
  attribution: AttributionSnapshot;
  clientIpAddress: string | null;
  clientUserAgent: string | null;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
}

/** Nothing has anything to send yet — a draft order isn't paid. See `DeliveryState`'s doc comment for the intended future lifecycle. */
function freshDeliveryState(): DeliveryState {
  return {
    status: "NOT_READY",
    attempts: 0,
    processingToken: null,
    processingStartedAt: null,
    leaseExpiresAt: null,
    lastAttemptAt: null,
    sentAt: null,
    lastErrorCode: null,
  };
}

/**
 * Checks a found order against the current request before treating it as a
 * safe idempotent replay. A matching `(batchId, idempotencyKey)` pair alone
 * is not enough — the key must also belong to the same registration and
 * describe the same (amount, currency) request, or this throws
 * `IdempotencyConflictError` rather than returning someone else's order.
 */
function assertSameRequest(
  existing: PaymentOrderDocument,
  registrationId: ObjectId,
  fingerprint: string,
): void {
  if (!existing.registrationId.equals(registrationId) || existing.requestFingerprint !== fingerprint) {
    throw new IdempotencyConflictError();
  }
}

/**
 * One draft order per `(batchId, idempotencyKey)`. A repeat call with the
 * same idempotency key returns the existing order untouched — but only when
 * it was created for the same registration and the same (amount, currency)
 * request; otherwise it's an idempotency-key collision, not a replay, and
 * this throws instead of handing back someone else's order. This never
 * marks anything as paid; every new order starts `CREATED` / `UNASSIGNED`
 * with both delivery side effects `NOT_READY`.
 */
export async function createDraftOrder(
  input: CreateDraftOrderInput,
  session?: ClientSession,
): Promise<{ order: PaymentOrderDocument; wasExisting: boolean }> {
  const collection = await getCollection();
  const fingerprint = computeOrderFingerprint({
    batchId: input.batchId,
    registrationId: input.registrationId,
    amount: input.amount,
    currency: input.currency,
  });

  const existing = await collection.findOne(
    { batchId: input.batchId, idempotencyKey: input.idempotencyKey },
    { session },
  );
  if (existing) {
    assertSameRequest(existing, input.registrationId, fingerprint);
    return { order: existing, wasExisting: true };
  }

  const now = new Date();
  const publicOrderRef = generatePublicOrderRef();

  const draft: PaymentOrderDocument = {
    publicOrderRef,
    registrationId: input.registrationId,
    masterclassSlug: input.masterclassSlug,
    batchId: input.batchId,
    amount: input.amount,
    currency: input.currency,
    status: "PENDING",
    /* Batch 1 only ever pays manually — the method (bKash/Nagad/Rocket) itself is chosen later. */
    provider: "MANUAL",
    method: null,
    manualPayment: null,
    verifiedAt: null,
    verifiedBy: null,
    rejectedReason: null,
    idempotencyKey: input.idempotencyKey,
    requestFingerprint: fingerprint,
    providerTransactionId: null,
    providerPaymentId: null,
    attribution: input.attribution,
    clientContext: {
      clientIpAddress: input.clientIpAddress,
      clientUserAgent: input.clientUserAgent,
    },
    metaEventIds: {
      initiateCheckout: null,
      purchase: `purchase_${publicOrderRef}`,
    },
    confirmationEmail: freshDeliveryState(),
    purchaseCapi: freshDeliveryState(),
    createdAt: now,
    updatedAt: now,
  };

  try {
    await collection.insertOne(draft, { session });
    return { order: draft, wasExisting: false };
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;

    /*
     * A concurrent duplicate request can lose the race between the read
     * above and this insert. The unique (batchId, idempotencyKey) index
     * turns that race into a duplicate-key error instead of a second
     * document — re-read and apply the same same-request check against the
     * winner rather than surfacing a 500.
     */
    const winner = await collection.findOne(
      { batchId: input.batchId, idempotencyKey: input.idempotencyKey },
      { session },
    );
    if (!winner) throw error;

    assertSameRequest(winner, input.registrationId, fingerprint);
    return { order: winner, wasExisting: true };
  }
}

export async function findOrderByPublicRef(
  publicOrderRef: string,
): Promise<PaymentOrderDocument | null> {
  const collection = await getCollection();
  return collection.findOne({ publicOrderRef });
}

/** Trim + uppercase — bKash/Nagad/Rocket TxIDs are alphanumeric and students copy-paste them inconsistently. */
export function normalizeTransactionId(raw: string): string {
  return raw.trim().toUpperCase();
}

export interface SubmitManualPaymentInput {
  publicOrderRef: string;
  method: ManualPaymentMethod;
  senderNumber: string;
  transactionIdRaw: string;
}

/**
 * Records the student's manual-payment evidence and moves the order to
 * `REVIEW`. Never sets `PAID` — that only ever happens in `verifyPayment()`,
 * driven by an operator. Allowed from `PENDING` or `REVIEW` (a student
 * correcting a mistyped TxID before an operator has looked at it); once the
 * order is `PAID`/`REJECTED`/`CANCELLED` this throws `OrderNotEditableError`.
 * A normalized TxID collision with a different order throws
 * `DuplicateTransactionError` rather than silently overwriting anything.
 */
export async function submitManualPayment(
  input: SubmitManualPaymentInput,
): Promise<PaymentOrderDocument> {
  const collection = await getCollection();
  const transactionIdNormalized = normalizeTransactionId(input.transactionIdRaw);
  const now = new Date();

  try {
    const updated = await collection.findOneAndUpdate(
      { publicOrderRef: input.publicOrderRef, status: { $in: ["PENDING", "REVIEW"] } },
      {
        $set: {
          status: "REVIEW",
          method: input.method,
          manualPayment: {
            senderNumber: input.senderNumber,
            transactionIdRaw: input.transactionIdRaw,
            transactionIdNormalized,
            submittedAt: now,
          },
          updatedAt: now,
        },
      },
      { returnDocument: "after" },
    );

    /* Either the order doesn't exist, or it's already PAID/REJECTED/CANCELLED — the route handler distinguishes those by looking the order up first. */
    if (!updated) throw new OrderNotEditableError();

    return updated;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new DuplicateTransactionError();
    }
    throw error;
  }
}

export interface VerifyPaymentInput {
  publicOrderRef: string;
  /** Opaque operator identifier (the Basic Auth username) — never a display name. */
  verifiedBy: string;
}

/**
 * `REVIEW → PAID`, guarded atomically by the `status: "REVIEW"` filter — a
 * second concurrent approval (or an approval of an order that was already
 * rejected/paid) matches nothing and returns `null` rather than
 * double-processing. Callers must treat `null` as "nothing to do," not an
 * error, so a retried request is naturally idempotent.
 */
export async function verifyPayment(input: VerifyPaymentInput): Promise<PaymentOrderDocument | null> {
  const collection = await getCollection();
  const now = new Date();
  return collection.findOneAndUpdate(
    { publicOrderRef: input.publicOrderRef, status: "REVIEW" },
    { $set: { status: "PAID", verifiedAt: now, verifiedBy: input.verifiedBy, updatedAt: now } },
    { returnDocument: "after" },
  );
}

export interface RejectPaymentInput {
  publicOrderRef: string;
  verifiedBy: string;
  reason: string | null;
}

/** `REVIEW → REJECTED`, same atomic guard as `verifyPayment()`. */
export async function rejectPayment(input: RejectPaymentInput): Promise<PaymentOrderDocument | null> {
  const collection = await getCollection();
  const now = new Date();
  return collection.findOneAndUpdate(
    { publicOrderRef: input.publicOrderRef, status: "REVIEW" },
    {
      $set: {
        status: "REJECTED",
        verifiedAt: now,
        verifiedBy: input.verifiedBy,
        rejectedReason: input.reason,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  );
}

/**
 * Records the outcome of an attempted confirmation-email or Meta-CAPI send
 * on the order's existing `DeliveryState` field. Never touches `status` —
 * a failed send here can never undo `PAID`. Called by `verify-service.ts`
 * immediately after each best-effort attempt, and again by the admin
 * "Retry" action for any order not yet `SENT`.
 */
export async function updateDeliveryState(
  publicOrderRef: string,
  field: "confirmationEmail" | "purchaseCapi",
  outcome: { ok: true } | { ok: false; errorCode: string },
): Promise<void> {
  const collection = await getCollection();
  const now = new Date();

  if (outcome.ok) {
    await collection.updateOne(
      { publicOrderRef },
      {
        $set: {
          [`${field}.status`]: "SENT",
          [`${field}.sentAt`]: now,
          [`${field}.lastAttemptAt`]: now,
          [`${field}.lastErrorCode`]: null,
          updatedAt: now,
        },
        $inc: { [`${field}.attempts`]: 1 },
      },
    );
    return;
  }

  await collection.updateOne(
    { publicOrderRef },
    {
      $set: {
        [`${field}.status`]: "FAILED",
        [`${field}.lastAttemptAt`]: now,
        [`${field}.lastErrorCode`]: outcome.errorCode,
        updatedAt: now,
      },
      $inc: { [`${field}.attempts`]: 1 },
    },
  );
}

/** Lean shape for the admin queue — never a full document dump, and never registration-side secrets. */
export interface AdminReviewOrder {
  publicOrderRef: string;
  publicRegistrationRef: string;
  name: string;
  email: string;
  phone: string;
  method: ManualPaymentMethod | null;
  amount: number;
  currency: string;
  manualPayment: PaymentOrderDocument["manualPayment"];
  attributionSource: string | null;
  createdAt: Date;
}

export interface ListOrdersForReviewResult {
  orders: AdminReviewOrder[];
  /** Pass back as `cursor` to fetch the next page; `null` when this was the last page. */
  nextCursor: string | null;
}

const REVIEW_PAGE_SIZE = 25;

/**
 * Oldest-first, cursor-paginated (never a full client-side dump — this must
 * hold up at 1,000–3,000 registrations). Joins in just the registration
 * fields an operator actually needs to verify a payment; nothing else.
 */
export async function listOrdersForReview(cursor?: string): Promise<ListOrdersForReviewResult> {
  const collection = await getCollection();

  const match: Record<string, unknown> = { status: "REVIEW" };
  if (cursor) {
    const [createdAtIso, id] = cursor.split("|");
    match.$or = [
      { createdAt: { $gt: new Date(createdAtIso) } },
      { createdAt: new Date(createdAtIso), _id: { $gt: id } },
    ];
  }

  const docs = await collection
    .aggregate<{
      publicOrderRef: string;
      method: ManualPaymentMethod | null;
      amount: number;
      currency: string;
      manualPayment: PaymentOrderDocument["manualPayment"];
      createdAt: Date;
      _id: ObjectId;
      registration: { publicRegistrationRef: string; name: string; email: string; phone: string }[];
      attribution: { utmSource?: string } | null;
    }>([
      { $match: match },
      { $sort: { createdAt: 1, _id: 1 } },
      { $limit: REVIEW_PAGE_SIZE },
      {
        $lookup: {
          from: "masterclass_registrations",
          localField: "registrationId",
          foreignField: "_id",
          as: "registration",
        },
      },
      {
        $project: {
          publicOrderRef: 1,
          method: 1,
          amount: 1,
          currency: 1,
          manualPayment: 1,
          createdAt: 1,
          attribution: "$attribution",
          "registration.publicRegistrationRef": 1,
          "registration.name": 1,
          "registration.email": 1,
          "registration.phone": 1,
        },
      },
    ])
    .toArray();

  const orders: AdminReviewOrder[] = docs
    .filter((doc) => doc.registration.length > 0)
    .map((doc) => ({
      publicOrderRef: doc.publicOrderRef,
      publicRegistrationRef: doc.registration[0].publicRegistrationRef,
      name: doc.registration[0].name,
      email: doc.registration[0].email,
      phone: doc.registration[0].phone,
      method: doc.method,
      amount: doc.amount,
      currency: doc.currency,
      manualPayment: doc.manualPayment,
      attributionSource: doc.attribution?.utmSource ?? null,
      createdAt: doc.createdAt,
    }));

  const last = docs.at(-1);
  const nextCursor =
    docs.length === REVIEW_PAGE_SIZE && last ? `${last.createdAt.toISOString()}|${last._id.toHexString()}` : null;

  return { orders, nextCursor };
}
