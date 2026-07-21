export interface NavLink {
  label: string;
  href: string;
}

export interface TrustIndicator {
  value: string;
  label: string;
}

export interface SkillGroup {
  title: string;
  items: readonly string[];
}

export interface Service {
  id: string;
  title: string;
  summary: string;
  includes: readonly string[];
  ctaLabel: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  /** The deployed app, as opposed to a source repository. */
  primary?: boolean;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  heading: string;
  description: string;
  highlights: readonly string[];
  tags: readonly string[];
  /** Live site and source repositories. Empty while a project has no public URL. */
  links: readonly ProjectLink[];
}

export interface Testimonial {
  id: string;
  quote: string;
  attribution: string;
  context: string;
  source: "Upwork" | "Fiverr";
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  includes: readonly string[];
  timeline: string;
  ctaLabel: string;
  badge?: string;
  featured?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface AffiliateTool {
  id: string;
  name: string;
  category: string;
  heading: string;
  description: string;
  usedFor: readonly string[];
  ctaLabel: string;
  /** Affiliate URL, copied exactly from portfolio-content.md. */
  href: string;
  /** Row in the /resources comparison table. */
  bestFor: string;
  useCase: string;
}

export interface SocialLink {
  label: string;
  href: string;
}
