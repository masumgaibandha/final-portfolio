/** Non-secret product facts. No pricing/date logic belongs in components. */
export interface MasterclassConfig {
  masterclassId: string;
  batchId: string;
  priceBDT: number;
  currency: string;
  /** Phase 1 is UI-only — checkout is intentionally non-functional until payment integration lands. */
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
