import { getClient } from "@/lib/mongodb";
import * as constants from "@/lib/masterclass/constants";
import {
  IdempotencyConflictError,
  RegistrationConflictError,
} from "@/lib/masterclass/errors";
import { createDraftOrder } from "@/lib/masterclass/payment-orders-repository";
import { upsertRegistration } from "@/lib/masterclass/registrations-repository";
import type { RegistrationInput } from "@/lib/masterclass/validation";
import type { AttributionSnapshot } from "@/types/masterclass-persistence";

export interface RegisterForMasterclassInput {
  input: RegistrationInput;
  emailNormalized: string;
  phoneE164: string;
  idempotencyKey: string;
  /** Derived server-side from request headers — never trusted from the body. */
  clientIpAddress: string | null;
  clientUserAgent: string | null;
}

export type RegisterForMasterclassResult =
  | { kind: "ok"; publicRegistrationRef: string; publicOrderRef: string; status: string }
  /** Existing email in this batch has a different phone on file — see `RegistrationConflictError`. */
  | { kind: "registration_conflict" }
  /** Idempotency key reused for a different registration or a different (amount, currency) request. */
  | { kind: "idempotency_conflict" };

/**
 * The one entry point that writes both collections. Runs in a single Atlas
 * transaction so a registration is never left without its draft order (or
 * vice versa) if the process dies partway through — `session.withTransaction`
 * also retries automatically on the transient write conflicts a concurrent
 * request to the same document can produce. Never marks anything PAID, never
 * sends email, never fires a Meta event — this only creates the two records
 * a future payment step will read and update.
 *
 * `RegistrationConflictError`/`IdempotencyConflictError` thrown deep inside
 * the transaction callback abort it (nothing partial is ever committed) and
 * are caught here, not re-thrown — they're expected business outcomes for
 * the route to turn into a 409, not a 500.
 */
export async function registerForMasterclass(
  params: RegisterForMasterclassInput,
): Promise<RegisterForMasterclassResult> {
  const { input, emailNormalized, phoneE164, idempotencyKey, clientIpAddress, clientUserAgent } =
    params;

  const attribution: AttributionSnapshot = {
    ...input.attribution,
    capturedAt: new Date(),
  };

  const client = await getClient();
  const session = client.startSession();

  try {
    let publicRegistrationRef = "";
    let publicOrderRef = "";
    let status = "";

    await session.withTransaction(async () => {
      const registration = await upsertRegistration(
        {
          masterclassSlug: constants.masterclassSlug,
          batchId: constants.batchId,
          name: input.name,
          email: input.email,
          emailNormalized,
          phone: input.phone,
          phoneE164,
          marketingConsent: input.marketingConsent,
          attribution,
        },
        session,
      );

      if (!registration._id) {
        throw new Error("Registration document is missing its _id after upsert.");
      }

      const { order } = await createDraftOrder(
        {
          registrationId: registration._id,
          masterclassSlug: constants.masterclassSlug,
          batchId: constants.batchId,
          amount: constants.amount,
          currency: constants.currency,
          idempotencyKey,
          attribution,
          clientIpAddress,
          clientUserAgent,
        },
        session,
      );

      publicRegistrationRef = registration.publicRegistrationRef;
      publicOrderRef = order.publicOrderRef;
      status = order.status;
    });

    return { kind: "ok", publicRegistrationRef, publicOrderRef, status };
  } catch (error) {
    if (error instanceof RegistrationConflictError) {
      return { kind: "registration_conflict" };
    }
    if (error instanceof IdempotencyConflictError) {
      return { kind: "idempotency_conflict" };
    }
    throw error;
  } finally {
    await session.endSession();
  }
}
