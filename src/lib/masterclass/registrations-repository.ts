import type { ClientSession, Collection } from "mongodb";

import { getDb } from "@/lib/mongodb";
import { policyVersions } from "@/lib/masterclass/constants";
import { RegistrationConflictError } from "@/lib/masterclass/errors";
import { generatePublicRegistrationRef } from "@/lib/masterclass/refs";
import type {
  AttributionSnapshot,
  RegistrationDocument,
} from "@/types/masterclass-persistence";

export const REGISTRATIONS_COLLECTION = "masterclass_registrations";

let indexesEnsured: Promise<void> | undefined;

async function ensureIndexes(
  collection: Collection<RegistrationDocument>,
): Promise<void> {
  indexesEnsured ??= (async () => {
    await Promise.all([
      collection.createIndex(
        { batchId: 1, emailNormalized: 1 },
        { unique: true, name: "uniq_batch_email" },
      ),
      collection.createIndex(
        { publicRegistrationRef: 1 },
        { unique: true, name: "uniq_public_registration_ref" },
      ),
    ]);
  })();
  return indexesEnsured;
}

async function getCollection(): Promise<Collection<RegistrationDocument>> {
  const db = await getDb();
  const collection = db.collection<RegistrationDocument>(REGISTRATIONS_COLLECTION);
  await ensureIndexes(collection);
  return collection;
}

export interface UpsertRegistrationInput {
  masterclassSlug: string;
  batchId: string;
  name: string;
  email: string;
  emailNormalized: string;
  phone: string;
  phoneE164: string;
  marketingConsent: boolean;
  attribution: AttributionSnapshot;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
}

/** Only `updatedAt`/`lastTouchAttribution` change on a matched retry — nothing identity- or consent-related. */
async function applyMatchedRetry(
  collection: Collection<RegistrationDocument>,
  existing: RegistrationDocument,
  attribution: AttributionSnapshot,
  session: ClientSession | undefined,
): Promise<RegistrationDocument> {
  const updated = await collection.findOneAndUpdate(
    { _id: existing._id },
    { $set: { updatedAt: new Date(), lastTouchAttribution: attribution } },
    { returnDocument: "after", session },
  );
  if (!updated) {
    throw new Error("Registration disappeared during a retry update.");
  }
  return updated;
}

/**
 * One registration per `(batchId, emailNormalized)`, with identity and
 * consent treated as immutable after creation:
 *
 * - No existing document for this batch/email → insert a new one.
 * - An existing document whose `phoneE164` matches the submitted phone →
 *   treated as the same student retrying. Only `updatedAt` and
 *   `lastTouchAttribution` are touched; `name`, `email`, `phone`,
 *   `phoneE164`, `consent`, and `firstTouchAttribution` are left exactly as
 *   first recorded, and the existing document is returned.
 * - An existing document whose `phoneE164` does NOT match → throws
 *   `RegistrationConflictError` (the caller turns this into a generic 409).
 *   Nothing is written in this case. A legitimate correction to an existing
 *   registration's name/phone is an owner-support action, not something this
 *   endpoint performs automatically.
 *
 * Transaction-safe under concurrency: two requests racing to create the
 * first registration for the same batch/email can both attempt the insert,
 * but the unique `(batchId, emailNormalized)` index lets only one succeed —
 * the loser re-reads and applies the same match/conflict comparison against
 * the winner's document, exactly as a genuine repeat submission would. A
 * write-write conflict on an existing document (two concurrent retries) is
 * caught by MongoDB's transaction layer itself and retried by
 * `session.withTransaction()`.
 */
export async function upsertRegistration(
  input: UpsertRegistrationInput,
  session?: ClientSession,
): Promise<RegistrationDocument> {
  const collection = await getCollection();
  const now = new Date();

  const existing = await collection.findOne(
    { batchId: input.batchId, emailNormalized: input.emailNormalized },
    { session },
  );

  if (existing) {
    if (existing.phoneE164 !== input.phoneE164) {
      throw new RegistrationConflictError();
    }
    return applyMatchedRetry(collection, existing, input.attribution, session);
  }

  const doc: RegistrationDocument = {
    publicRegistrationRef: generatePublicRegistrationRef(),
    masterclassSlug: input.masterclassSlug,
    batchId: input.batchId,
    name: input.name,
    email: input.email,
    emailNormalized: input.emailNormalized,
    phone: input.phone,
    phoneE164: input.phoneE164,
    status: "PENDING_PAYMENT",
    consent: {
      accepted: true,
      privacyPolicyVersion: policyVersions.privacy,
      termsVersion: policyVersions.terms,
      refundPolicyVersion: policyVersions.refund,
      acceptedAt: now,
      marketingConsent: input.marketingConsent,
    },
    firstTouchAttribution: input.attribution,
    lastTouchAttribution: input.attribution,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await collection.insertOne(doc, { session });
    return doc;
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;

    /* Lost the insert race — a concurrent request created it first. Apply the same match/conflict rule against the winner. */
    const winner = await collection.findOne(
      { batchId: input.batchId, emailNormalized: input.emailNormalized },
      { session },
    );
    if (!winner) throw error;

    if (winner.phoneE164 !== input.phoneE164) {
      throw new RegistrationConflictError();
    }
    return applyMatchedRetry(collection, winner, input.attribution, session);
  }
}

export async function findRegistrationByPublicRef(
  publicRegistrationRef: string,
): Promise<RegistrationDocument | null> {
  const collection = await getCollection();
  return collection.findOne({ publicRegistrationRef });
}
