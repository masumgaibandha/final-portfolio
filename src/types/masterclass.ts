/**
 * The one content/config flag that isn't server-only. Everything else that
 * used to live here (masterclassId/batchId/priceBDT/currency) was a second,
 * driftable copy of what `src/lib/masterclass/constants.ts` already owns
 * authoritatively — removed rather than kept in sync by hand. Read
 * `constants.ts` (slug, batchId, pricing, dates) for those.
 */
export interface MasterclassConfig {
  /** True once a payment path exists behind the form — manual bKash/Nagad/Rocket, as of Batch 1. */
  checkoutEnabled: boolean;
}

export interface OfferDetail {
  label: string;
}

export interface TrustMetric {
  value: string;
  label: string;
}

export interface CurriculumDay {
  id: string;
  dayLabel: string;
  heading: string;
  items: readonly string[];
}

export interface WorkflowStep {
  label: string;
}

/** A sanitized derivative in `public/masterclass/`, never a raw file from `resources/`. */
export interface ProofAsset {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/** An external, verifiable public profile — always opens in a new tab. */
export interface ProfileLink {
  label: string;
  href: string;
}

/** Bengali display copy for one manual payment channel — the account number itself always comes from env, never from here. */
export interface ManualPaymentMethodCopy {
  label: string;
  instructions: string;
}
