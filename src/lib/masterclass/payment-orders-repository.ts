import type { ClientSession, Collection, ObjectId } from "mongodb";

import { IdempotencyConflictError } from "@/lib/masterclass/errors";
import { computeOrderFingerprint } from "@/lib/masterclass/fingerprint";
import { getDb } from "@/lib/mongodb";
import { generatePublicOrderRef } from "@/lib/masterclass/refs";
import type {
  AttributionSnapshot,
  DeliveryState,
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
    status: "CREATED",
    provider: "UNASSIGNED",
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
