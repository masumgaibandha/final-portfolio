import { describe, expect, it } from "vitest";

import { earlyBirdEndsAt, earlyBirdPriceBDT, regularPriceBDT, resolvePriceBDT } from "@/lib/masterclass/constants";

describe("resolvePriceBDT", () => {
  it("returns the early-bird price when there is no deadline (current Batch 1 config)", () => {
    expect(earlyBirdEndsAt).toBeNull();
    expect(resolvePriceBDT(new Date("2026-09-01T00:00:00Z"))).toBe(earlyBirdPriceBDT);
  });

  it("is a pure function of `now` — same input always yields the same price", () => {
    const now = new Date("2026-08-20T00:00:00Z");
    expect(resolvePriceBDT(now)).toBe(resolvePriceBDT(now));
  });

  it("early-bird and regular prices are the two prices required by the business decision", () => {
    expect(earlyBirdPriceBDT).toBe(1499);
    expect(regularPriceBDT).toBe(1999);
  });

  /*
   * `earlyBirdEndsAt` is `null` by design today (no real cutoff has been
   * decided yet — see constants.ts). The `now >= earlyBirdEndsAt →
   * regularPriceBDT` branch inside `resolvePriceBDT` therefore can't be
   * exercised through the real module constant without faking a deadline
   * that doesn't exist in production; once a real `earlyBirdEndsAt` is set,
   * add a case here asserting a `now` past it returns `regularPriceBDT`.
   */
});
