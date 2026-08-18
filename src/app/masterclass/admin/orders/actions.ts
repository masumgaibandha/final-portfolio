"use server";

import { revalidatePath } from "next/cache";

import { site } from "@/data/site";
import { UnauthorizedAdminError, requireMasterclassAdmin } from "@/lib/masterclass/admin-auth";
import { findOrderByPublicRef } from "@/lib/masterclass/payment-orders-repository";
import { approvePayment, rejectPaymentOrder, retryDelivery } from "@/lib/masterclass/verify-service";

/*
 * Every action here independently calls `requireMasterclassAdmin()` first —
 * not because `middleware.ts` might be misconfigured, but because a Server
 * Action's POST isn't guaranteed to route through the same path-matched
 * middleware that protects a normal page load (see the doc comment on
 * `requireMasterclassAdmin()` for why). Nothing below this check ever runs
 * for an unauthorized caller: no repository read, no status transition, no
 * email, no Meta CAPI call.
 */

const EVENT_SOURCE_URL = `${site.url}/masterclass/lead-generation-cold-email`;
const ADMIN_ORDERS_PATH = "/masterclass/admin/orders";

export interface ActionResult {
  ok: boolean;
  message: string;
  needsRetry?: boolean;
}

function deliverySummary(order: Awaited<ReturnType<typeof findOrderByPublicRef>>): {
  message: string;
  needsRetry: boolean;
} {
  const emailOk = order?.confirmationEmail.status === "SENT";
  const capiOk = order?.purchaseCapi.status === "SENT";
  const parts = [
    emailOk ? "Confirmation email sent." : `Confirmation email NOT sent (${order?.confirmationEmail.lastErrorCode ?? "unknown"}).`,
    capiOk ? "Meta Purchase event sent." : `Meta Purchase event NOT sent (${order?.purchaseCapi.lastErrorCode ?? "unknown"}).`,
  ];
  return { message: parts.join(" "), needsRetry: !emailOk || !capiOk };
}

/**
 * Every action calls this first, before touching any repository, email, or
 * Meta call. Returns the verified admin username, or `null` if the caller
 * is unauthorized — callers must check for `null` and stop immediately.
 * The one place `requireMasterclassAdmin()`'s thrown error is turned into a
 * plain result the UI can render, so it's written once, not three times.
 */
async function authorizeOrReject(): Promise<string | null> {
  try {
    return await requireMasterclassAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedAdminError) return null;
    throw error;
  }
}

export async function approveOrderAction(publicOrderRef: string): Promise<ActionResult> {
  const verifiedBy = await authorizeOrReject();
  if (!verifiedBy) return { ok: false, message: "Not authorized." };

  const result = await approvePayment(publicOrderRef, verifiedBy, EVENT_SOURCE_URL);
  revalidatePath(ADMIN_ORDERS_PATH);

  if (result.kind === "not_found") return { ok: false, message: "Order not found." };
  if (result.kind === "already_processed") {
    return { ok: false, message: "This order was already processed — it's no longer in REVIEW." };
  }

  const fresh = await findOrderByPublicRef(publicOrderRef);
  const { message, needsRetry } = deliverySummary(fresh);
  return { ok: true, message: `Approved — order is now PAID. ${message}`, needsRetry };
}

export async function rejectOrderAction(publicOrderRef: string, reason: string): Promise<ActionResult> {
  const verifiedBy = await authorizeOrReject();
  if (!verifiedBy) return { ok: false, message: "Not authorized." };

  const result = await rejectPaymentOrder(publicOrderRef, verifiedBy, reason.trim() || null);
  revalidatePath(ADMIN_ORDERS_PATH);

  if (result.kind === "not_found") return { ok: false, message: "Order not found." };
  if (result.kind === "already_processed") {
    return { ok: false, message: "This order was already processed — it's no longer in REVIEW." };
  }
  return { ok: true, message: `Rejected. The student is not notified automatically — contact them if needed.` };
}

export async function retryDeliveryAction(publicOrderRef: string): Promise<ActionResult> {
  const verifiedBy = await authorizeOrReject();
  if (!verifiedBy) return { ok: false, message: "Not authorized." };

  await retryDelivery(publicOrderRef, EVENT_SOURCE_URL);
  const fresh = await findOrderByPublicRef(publicOrderRef);
  const { message, needsRetry } = deliverySummary(fresh);
  return { ok: !needsRetry, message, needsRetry };
}
