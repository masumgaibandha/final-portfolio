import { createHash } from "node:crypto";

import type { AttributionSnapshot, PaymentOrderDocument } from "@/types/masterclass-persistence";

/**
 * Server-only Meta Conversions API. `META_CAPI_ACCESS_TOKEN` only ever lives
 * in `process.env`, read via `getMetaCapiEnv()` (`src/lib/env.ts`) — never
 * imported by a Client Component. Purchase is CAPI-only in this project (see
 * the doc comment on `sendPurchaseEvent` below); no browser Pixel Purchase
 * call exists anywhere.
 */

const GRAPH_API_VERSION = "v21.0";
const REQUEST_TIMEOUT_MS = 8000;

function sha256Lower(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** E.164 phone → digits only (Meta's documented `ph` normalization: no leading `+`, no separators) before hashing. */
function hashPhone(phoneE164: string): string {
  return sha256Lower(phoneE164.replace(/[^0-9]/g, ""));
}

export type MetaCapiResult = { ok: true } | { ok: false; errorCode: string };

export interface SendPurchaseEventInput {
  order: PaymentOrderDocument;
  emailNormalized: string;
  phoneE164: string;
  attribution: AttributionSnapshot | null;
  eventSourceUrl: string;
  pixelId: string;
  accessToken: string;
}

/**
 * Purchase is authoritative from the server only — Batch 1 has no gateway
 * redirect, so verification happens after the student has left the site
 * (sometimes days later). A browser `fbq('track','Purchase')` would have to
 * either fire falsely at TxID-submission time (explicitly forbidden) or
 * never fire at all. CAPI, sent exactly once at `REVIEW → PAID`, is the
 * single source of truth for this event — see the report for the fuller
 * rationale. `event_id` is the order's own deterministic
 * `metaEventIds.purchase` (`purchase_${publicOrderRef}`, computed at order
 * creation), so if a future real gateway ever adds a matching browser event,
 * the two dedupe correctly with zero schema change.
 */
export async function sendPurchaseEvent(input: SendPurchaseEventInput): Promise<MetaCapiResult> {
  const { order, attribution } = input;

  const userData: Record<string, unknown> = {
    em: [sha256Lower(input.emailNormalized)],
    ph: [hashPhone(input.phoneE164)],
    client_ip_address: order.clientContext.clientIpAddress ?? undefined,
    client_user_agent: order.clientContext.clientUserAgent ?? undefined,
    /* fbp/fbc are click/browser identifiers, not PII — sent as-is per Meta's spec, never hashed. */
    fbp: attribution?.fbp,
    fbc: attribution?.fbc,
  };

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor((order.verifiedAt ?? new Date()).getTime() / 1000),
        event_id: order.metaEventIds.purchase,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: {
          currency: order.currency,
          value: order.amount,
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${input.pixelId}/events?access_token=${encodeURIComponent(input.accessToken)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      /* Never log the response body — it can echo back the request, including hashed PII and the access token context. */
      return { ok: false, errorCode: `HTTP_${response.status}` };
    }

    return { ok: true };
  } catch (error) {
    const errorCode = error instanceof Error && error.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR";
    return { ok: false, errorCode };
  } finally {
    clearTimeout(timeout);
  }
}
