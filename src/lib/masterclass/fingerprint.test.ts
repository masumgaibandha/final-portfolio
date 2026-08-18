import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

import { computeOrderFingerprint } from "@/lib/masterclass/fingerprint";

describe("computeOrderFingerprint", () => {
  const registrationId = new ObjectId();

  it("is deterministic for identical input", () => {
    const input = { batchId: "batch-2026-10", registrationId, amount: 1499, currency: "BDT" };
    expect(computeOrderFingerprint(input)).toBe(computeOrderFingerprint(input));
  });

  it("changes when the amount changes", () => {
    const a = computeOrderFingerprint({ batchId: "batch-2026-10", registrationId, amount: 1499, currency: "BDT" });
    const b = computeOrderFingerprint({ batchId: "batch-2026-10", registrationId, amount: 1999, currency: "BDT" });
    expect(a).not.toBe(b);
  });

  it("changes when the registration id changes", () => {
    const a = computeOrderFingerprint({ batchId: "batch-2026-10", registrationId, amount: 1499, currency: "BDT" });
    const b = computeOrderFingerprint({
      batchId: "batch-2026-10",
      registrationId: new ObjectId(),
      amount: 1499,
      currency: "BDT",
    });
    expect(a).not.toBe(b);
  });
});
