import type { IconType } from "react-icons";

export interface NavLink {
  label: string;
  href: string;
}

export interface TrustIndicator {
  value: string;
  label: string;
}

export interface Skill {
  name: string;
  /**
   * Brand mark, or a generic glyph where no brand exists. Always decorative:
   * every skill renders its name as text beside it, so the icon carries no
   * information of its own.
   */
  icon: IconType;
  /**
   * Tailwind text-colour class for the mark. Must be written as a literal in
   * `src/data/skills.ts` — a class assembled at runtime is invisible to
   * Tailwind's scanner and would never be emitted.
   */
  iconClass: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: readonly Skill[];
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

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /**
   * Tailwind `object-*` class picking which part survives the cover crop.
   * Must be a literal class so Tailwind's scanner emits it. Chosen per image
   * from where its important UI actually sits — a centre crop clips the
   * DentFlow and SkillPath headlines, which start near the left edge.
   */
  objectPosition: string;
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
  /**
   * A real screenshot of the shipped product. Omitted rather than substituted
   * when no genuine capture exists — never a stock or generated stand-in.
   */
  image?: ProjectImage;
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

/** Frontmatter as authored in `content/blog/*.mdx`. */
export interface BlogFrontmatter {
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD), used for display and the `datetime` attribute. */
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  coverAlt?: string;
  tags: readonly string[];
  draft: boolean;
}

/** A post as the app consumes it: frontmatter plus derived fields. */
export interface BlogPost extends BlogFrontmatter {
  /** Filename without the extension, and the URL segment. */
  slug: string;
  readingMinutes: number;
}
