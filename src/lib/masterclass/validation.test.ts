import { describe, expect, it } from "vitest";

import {
  attributionInputSchema,
  manualPaymentInputSchema,
  normalizeBangladeshPhone,
  registrationInputSchema,
} from "@/lib/masterclass/validation";

describe("normalizeBangladeshPhone", () => {
  it("accepts 01XXXXXXXXX and returns +8801XXXXXXXXX", () => {
    expect(normalizeBangladeshPhone("01712345678")).toBe("+8801712345678");
  });

  it("accepts 8801XXXXXXXXX", () => {
    expect(normalizeBangladeshPhone("8801812345678")).toBe("+8801812345678");
  });

  it("accepts +8801XXXXXXXXX and strips spaces/dashes", () => {
    expect(normalizeBangladeshPhone("+880 191-234-5678")).toBe("+8801912345678");
  });

  it("rejects an invalid mobile prefix", () => {
    expect(normalizeBangladeshPhone("01212345678")).toBeNull(); // 012 is not a valid BD mobile prefix
  });

  it("rejects a landline-length or malformed number", () => {
    expect(normalizeBangladeshPhone("0171234")).toBeNull();
    expect(normalizeBangladeshPhone("not-a-phone")).toBeNull();
  });
});

describe("registrationInputSchema — invalid email", () => {
  it("rejects a malformed email", () => {
    const result = registrationInputSchema.safeParse({
      name: "Rahim Uddin",
      email: "not-an-email",
      phone: "01712345678",
      termsAccepted: true,
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });
});

describe("registrationInputSchema — invalid phone", () => {
  it("rejects a phone that fails Bangladeshi mobile normalization", () => {
    const result = registrationInputSchema.safeParse({
      name: "Rahim Uddin",
      email: "rahim@example.com",
      phone: "123",
      termsAccepted: true,
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });
});

describe("registrationInputSchema — a client-submitted price is never accepted", () => {
  it("silently strips an unrecognized `amount`/`price` field rather than accepting it", () => {
    const result = registrationInputSchema.safeParse({
      name: "Rahim Uddin",
      email: "rahim@example.com",
      phone: "01712345678",
      termsAccepted: true,
      turnstileToken: "token",
      amount: 1, // not a field on this schema — must never influence the stored price
      price: 1,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("amount");
      expect(result.data).not.toHaveProperty("price");
    }
  });
});

describe("manualPaymentInputSchema", () => {
  it("accepts a valid bKash submission", () => {
    const result = manualPaymentInputSchema.safeParse({
      method: "BKASH",
      senderNumber: "01712345678",
      transactionId: "9G7H2K1XYZ",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid Nagad submission", () => {
    const result = manualPaymentInputSchema.safeParse({
      method: "NAGAD",
      senderNumber: "01812345678",
      transactionId: "NGD123456",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid Rocket submission", () => {
    const result = manualPaymentInputSchema.safeParse({
      method: "ROCKET",
      senderNumber: "01912345678",
      transactionId: "RKT123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid payment method", () => {
    const result = manualPaymentInputSchema.safeParse({
      method: "PAYPAL",
      senderNumber: "01712345678",
      transactionId: "TXID12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing transaction ID", () => {
    const result = manualPaymentInputSchema.safeParse({
      method: "BKASH",
      senderNumber: "01712345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a price/amount field even if the client sends one — the schema has no such field at all", () => {
    const result = manualPaymentInputSchema.safeParse({
      method: "BKASH",
      senderNumber: "01712345678",
      transactionId: "TXID12345",
      amount: 1,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("amount");
    }
  });
});

describe("attributionInputSchema", () => {
  it("keeps UTM parameters", () => {
    const result = attributionInputSchema.safeParse({
      utmSource: "facebook",
      utmMedium: "cpc",
      utmCampaign: "batch1-launch",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.utmSource).toBe("facebook");
      expect(result.data.utmMedium).toBe("cpc");
      expect(result.data.utmCampaign).toBe("batch1-launch");
    }
  });

  it("keeps fbclid", () => {
    const result = attributionInputSchema.safeParse({ fbclid: "IwAR123abc" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.fbclid).toBe("IwAR123abc");
  });

  it("keeps fbp/fbc when present", () => {
    const result = attributionInputSchema.safeParse({
      fbp: "fb.1.1699999999.111",
      fbc: "fb.1.1699999999.IwAR123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fbp).toBe("fb.1.1699999999.111");
      expect(result.data.fbc).toBe("fb.1.1699999999.IwAR123");
    }
  });
});
