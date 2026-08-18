import type { Metadata } from "next";

import { OrderRow } from "@/components/masterclass/admin/OrderRow";
import { UnauthorizedAdminError, requireMasterclassAdmin } from "@/lib/masterclass/admin-auth";
import { listOrdersForReview } from "@/lib/masterclass/payment-orders-repository";

/* Never indexed, never in the sitemap — protection here is belt-and-suspenders alongside `middleware.ts`'s Basic Auth. */
export const metadata: Metadata = {
  title: "Payment review",
  robots: { index: false, follow: false },
};

/* Every request must see the current REVIEW queue — never statically cached. */
export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{ cursor?: string }>;
}

/**
 * This page renders student names, emails, phone numbers, and transaction
 * IDs — sensitive enough that it independently re-verifies the caller here
 * too, not just for the mutations. `middleware.ts` already blocks an
 * unauthenticated GET to this exact path, so in normal operation this never
 * throws; it exists so a future change to the middleware matcher (or any
 * other way this component could end up rendered) can never accidentally
 * expose this data without going through the same check the mutations use.
 */
export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  try {
    await requireMasterclassAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedAdminError) {
      return (
        <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 480, margin: "4rem auto", padding: "0 1.25rem" }}>
          <h1 style={{ fontSize: "1.2rem" }}>Not authorized</h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Sign in with valid admin credentials to view this page.</p>
        </main>
      );
    }
    throw error;
  }

  const { cursor } = await searchParams;
  const { orders, nextCursor } = await listOrdersForReview(cursor);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 880, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
      <h1 style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>Masterclass — payments awaiting review</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Oldest submissions first. Approving sets the order to PAID, enrolls the student, and (best-effort) sends
        the confirmation email and a Meta Purchase event. Rejecting does not notify the student automatically.
      </p>

      {orders.length === 0 ? <p>Nothing waiting for review right now.</p> : null}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {orders.map((order) => (
          <OrderRow key={order.publicOrderRef} order={order} />
        ))}
      </div>

      {nextCursor ? (
        <p style={{ marginTop: "1.5rem" }}>
          <a href={`/masterclass/admin/orders?cursor=${encodeURIComponent(nextCursor)}`}>Next page →</a>
        </p>
      ) : null}
    </main>
  );
}
