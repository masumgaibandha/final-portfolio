"use client";

import { useState, useTransition } from "react";

import {
  approveOrderAction,
  rejectOrderAction,
  retryDeliveryAction,
} from "@/app/masterclass/admin/orders/actions";
import type { AdminReviewOrder } from "@/lib/masterclass/payment-orders-repository";

const METHOD_LABEL: Record<string, string> = { BKASH: "bKash", NAGAD: "Nagad", ROCKET: "Rocket" };

/**
 * The entire admin UI in one small client island — everything else on the
 * page is a Server Component. No dashboard framework, no client-side
 * fetching: every action is a direct Server Action call, protected by the
 * same Basic Auth middleware guarding the page this is rendered on.
 */
export function OrderRow({ order }: { order: AdminReviewOrder }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [needsRetry, setNeedsRetry] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [reason, setReason] = useState("");

  function approve() {
    startTransition(async () => {
      const result = await approveOrderAction(order.publicOrderRef);
      setMessage(result.message);
      setNeedsRetry(Boolean(result.needsRetry));
      if (result.ok) setProcessed(true);
    });
  }

  function reject() {
    startTransition(async () => {
      const result = await rejectOrderAction(order.publicOrderRef, reason);
      setMessage(result.message);
      if (result.ok) setProcessed(true);
    });
  }

  function retry() {
    startTransition(async () => {
      const result = await retryDeliveryAction(order.publicOrderRef);
      setMessage(result.message);
      setNeedsRetry(Boolean(result.needsRetry));
    });
  }

  return (
    <div style={{ border: "1px solid #d8d8d0", borderRadius: 8, padding: "1rem", opacity: processed ? 0.6 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", fontWeight: 600 }}>
        <span>{order.publicRegistrationRef}</span>
        <span style={{ fontWeight: 400, color: "#666" }}>{new Date(order.createdAt).toLocaleString()}</span>
      </div>
      <p style={{ margin: "0.4rem 0" }}>
        {order.name} &middot; {order.email} &middot; {order.phone}
      </p>
      <p style={{ margin: "0.4rem 0" }}>
        <strong>{order.method ? METHOD_LABEL[order.method] : "—"}</strong> &middot; sender{" "}
        {order.manualPayment?.senderNumber ?? "—"} &middot; TxID{" "}
        <code>{order.manualPayment?.transactionIdRaw ?? "—"}</code> &middot; {order.currency} {order.amount}
      </p>
      {order.attributionSource ? (
        <p style={{ margin: "0.4rem 0", fontSize: "0.82em", color: "#888" }}>utm_source: {order.attributionSource}</p>
      ) : null}

      {!processed ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.6rem" }}>
          <button type="button" onClick={approve} disabled={isPending}>
            Approve → PAID
          </button>
          <input
            placeholder="Rejection reason (optional)"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            style={{ flex: "1 1 200px" }}
          />
          <button type="button" onClick={reject} disabled={isPending}>
            Reject
          </button>
        </div>
      ) : null}

      {needsRetry ? (
        <button type="button" onClick={retry} disabled={isPending} style={{ marginTop: "0.6rem" }}>
          Retry email / Meta CAPI
        </button>
      ) : null}

      {message ? <p style={{ marginTop: "0.6rem", fontSize: "0.9em" }}>{message}</p> : null}
    </div>
  );
}
