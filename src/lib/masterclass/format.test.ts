import { describe, expect, it } from "vitest";

import { formatBDT } from "@/lib/masterclass/format";

describe("formatBDT", () => {
  it("formats the early-bird price with the Bengali Taka sign and Bengali digits", () => {
    expect(formatBDT(1499)).toBe("৳১,৪৯৯");
  });

  it("formats the regular price", () => {
    expect(formatBDT(1999)).toBe("৳১,৯৯৯");
  });

  it("formats a value under 1000 with no thousands separator", () => {
    expect(formatBDT(500)).toBe("৳৫০০");
  });
});
