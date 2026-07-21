import type { BlogPost } from "@/types";

export const blogPage = {
  seoTitle: "Blog | MasumDev",
  metaDescription:
    "Notes on full-stack development, cold email infrastructure, and deliverability from Abdullah Al Masum — practical write-ups from real client work.",
  label: "Writing",
  heading: "Notes From the Work",
  intro:
    "Write-ups on building web products and running outreach systems — what actually worked, what broke, and what I would do differently.",
} as const;

/*
 * Empty until real posts exist. Do NOT seed this with placeholder or invented
 * articles: the page renders an honest empty state when the list is empty, and
 * a fabricated post would misrepresent published work. Add entries here as
 * pieces are actually written.
 */
export const blogPosts: readonly BlogPost[] = [];

export const blogEmptyState = {
  heading: "No posts published yet",
  description:
    "I’m writing the first pieces now — likely on cold email infrastructure, deliverability, and shipping SaaS products with Next.js. In the meantime, the projects and outreach stack pages cover how I work.",
  primaryLabel: "See selected work",
  secondaryLabel: "Get in touch",
} as const;
