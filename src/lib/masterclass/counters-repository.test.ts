import { describe, expect, it } from "vitest";

import { formatRegistrationRef } from "@/lib/masterclass/counters-repository";

/*
 * Only the pure formatter is unit-tested here. `getNextSequence()` and
 * `generateHumanRegistrationRef()` need a live MongoDB connection (an
 * atomic `findOneAndUpdate`) — this project deliberately doesn't add
 * `mongodb-memory-server` to test that (see the implementation plan), so
 * the atomic-increment behavior itself is verified by code review, not an
 * automated test.
 */
describe("formatRegistrationRef", () => {
  it("matches the MC-<year>-<6-digit sequence> convention", () => {
    expect(formatRegistrationRef(2026, 123)).toBe("MC-2026-000123");
  });

  it("zero-pads a small sequence number to 6 digits", () => {
    expect(formatRegistrationRef(2026, 1)).toBe("MC-2026-000001");
  });

  it("does not truncate a sequence number wider than 6 digits", () => {
    expect(formatRegistrationRef(2026, 1234567)).toBe("MC-2026-1234567");
  });
});
