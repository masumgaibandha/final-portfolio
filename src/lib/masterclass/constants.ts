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

/**
 * One centralized, immutable version per legal document. Bump the relevant
 * date whenever that document's *content* materially changes — every new
 * registration's consent evidence stamps the version in effect at the
 * moment of acceptance (see `ConsentRecord` in
 * `src/types/masterclass-persistence.ts`), so a later bump never rewrites
 * what an earlier student actually agreed to.
 *
 * Bengali page content lives in `src/data/legal-content.ts` — this object is
 * the only place a version string is defined; nothing else should hardcode
 * one, and the client must never be trusted to supply one.
 */
export const policyVersions = {
  privacy: "2026-08-09",
  terms: "2026-08-09",
  refund: "2026-08-09",
} as const;

const UNPUBLISHED_PRIVACY_VERSION = "unpublished-draft";

/**
 * `false` until a real privacy policy is published and `policyVersions.privacy`
 * is bumped past the placeholder. The registration route must fail closed on
 * this even if `MASTERCLASS_REGISTRATION_ENABLED` is accidentally set to
 * `"true"` — accepting consent for a policy that doesn't exist yet isn't a
 * recoverable mistake after the fact. Phase 3A publishes `/privacy-policy`,
 * so this now evaluates to `true`; registration stays disabled regardless
 * because `MASTERCLASS_REGISTRATION_ENABLED` is still `false` in `.env`.
 */
export function isPrivacyPolicyPublished(): boolean {
  /* Widened to `string`: `policyVersions.privacy` is now a fixed literal
     ("2026-08-09"), so comparing the literal type directly against the
     placeholder is a compile-time-provable `true` and TS (correctly) flags
     it as a suspicious comparison. The runtime check is still real — this
     keeps it alive for the day the constant reverts to the placeholder. */
  const currentPrivacyVersion: string = policyVersions.privacy;
  return currentPrivacyVersion !== UNPUBLISHED_PRIVACY_VERSION;
}
