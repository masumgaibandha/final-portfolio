/**
 * Authoritative, server-only masterclass facts. The browser must never be
 * trusted to supply price, currency, slug, or batch for a registration or
 * order — every persistence write reads these constants, never a
 * client-submitted value. (Distinct from `src/data/masterclass-content.ts`,
 * which is display copy for the UI, not a source of truth for writes.)
 */
export const masterclassSlug = "lead-generation-cold-email";
export const batchId = "lead-generation-cold-email-2026-10";
export const amount = 2000;
export const currency = "BDT";

/** Bumped whenever the (not yet published) privacy policy materially changes. */
export const privacyPolicyVersion = "unpublished-draft";

const UNPUBLISHED_PRIVACY_VERSION = "unpublished-draft";

/**
 * `false` until a real privacy policy is published and `privacyPolicyVersion`
 * is bumped past the placeholder. The registration route must fail closed on
 * this even if `MASTERCLASS_REGISTRATION_ENABLED` is accidentally set to
 * `"true"` — accepting consent for a policy that doesn't exist yet isn't a
 * recoverable mistake after the fact.
 */
export function isPrivacyPolicyPublished(): boolean {
  return privacyPolicyVersion !== UNPUBLISHED_PRIVACY_VERSION;
}
