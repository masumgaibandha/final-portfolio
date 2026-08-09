import { z } from "zod";

/**
 * Server-side validation and normalization for the masterclass registration
 * API. Shared by the (currently disabled) route handler and its future
 * tests — nothing here is UI-specific.
 */

const MAX_ATTRIBUTION_FIELD_LENGTH = 512;
const MAX_URL_FIELD_LENGTH = 2048;

/*
 * Plain `z.object()` strips unrecognized keys by default (no `.passthrough()`
 * used) — that is what satisfies "ignore unknown attribution properties"
 * below, not an explicit allow-list check.
 */
export const attributionInputSchema = z.object({
  utmSource: z.string().trim().min(1).max(MAX_ATTRIBUTION_FIELD_LENGTH).optional(),
  utmMedium: z.string().trim().min(1).max(MAX_ATTRIBUTION_FIELD_LENGTH).optional(),
  utmCampaign: z.string().trim().min(1).max(MAX_ATTRIBUTION_FIELD_LENGTH).optional(),
  utmContent: z.string().trim().min(1).max(MAX_ATTRIBUTION_FIELD_LENGTH).optional(),
  utmTerm: z.string().trim().min(1).max(MAX_ATTRIBUTION_FIELD_LENGTH).optional(),
  fbclid: z.string().trim().min(1).max(MAX_ATTRIBUTION_FIELD_LENGTH).optional(),
  fbp: z.string().trim().min(1).max(MAX_ATTRIBUTION_FIELD_LENGTH).optional(),
  fbc: z.string().trim().min(1).max(MAX_ATTRIBUTION_FIELD_LENGTH).optional(),
  landingPage: z.string().trim().min(1).max(MAX_URL_FIELD_LENGTH).optional(),
  referrer: z.string().trim().min(1).max(MAX_URL_FIELD_LENGTH).optional(),
});

export type AttributionInput = z.infer<typeof attributionInputSchema>;

const BD_MOBILE_LOCAL = /^01[3-9]\d{8}$/;

/**
 * Accepts `01XXXXXXXXX`, `8801XXXXXXXXX`, or `+8801XXXXXXXXX` with only
 * mobile prefixes 013–019. Returns the normalized `+8801XXXXXXXXX` form, or
 * `null` if the input doesn't match any of those shapes.
 */
export function normalizeBangladeshPhone(raw: string): string | null {
  const trimmed = raw.trim().replace(/[\s-]/g, "");

  let local: string;
  if (trimmed.startsWith("+880")) {
    local = `0${trimmed.slice(4)}`;
  } else if (trimmed.startsWith("880")) {
    local = `0${trimmed.slice(3)}`;
  } else {
    local = trimmed;
  }

  if (!BD_MOBILE_LOCAL.test(local)) return null;
  return `+880${local.slice(1)}`;
}

export const registrationInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be at most 80 characters."),
  email: z
    .string()
    .trim()
    .max(254, "Email is too long.")
    .email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long.")
    .refine(
      (value) => normalizeBangladeshPhone(value) !== null,
      "Enter a valid Bangladeshi mobile number.",
    ),
  /* Must be the literal `true` — omitted, `false`, or any other value fails. */
  termsAccepted: z.literal(true, "Terms and privacy acceptance is required."),
  /* Always explicit, always separate from terms acceptance, defaults to false. */
  marketingConsent: z.boolean().default(false),
  attribution: attributionInputSchema.optional(),
});

export type RegistrationInput = z.infer<typeof registrationInputSchema>;

export const idempotencyKeySchema = z
  .string()
  .uuid("Idempotency-Key must be a valid UUID.");

/** Generic — never echoes the field's submitted value, only which field and why. */
export interface ValidationFailure {
  field: string;
  message: string;
}

export function toValidationFailures(error: z.ZodError): ValidationFailure[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "(root)",
    message: issue.message,
  }));
}
