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
 * Posts are no longer listed here — they come from `content/blog/*.mdx` via
 * `src/lib/blog.ts`. This file holds only the page's own copy.
 *
 * Do not add placeholder or invented articles to `content/blog`: the index
 * renders an honest empty state when nothing is published, and a fabricated
 * post would misrepresent real work.
 */
export const blogEmptyState = {
  heading: "No posts published yet",
  description:
    "I’m writing the first pieces now — likely on cold email infrastructure, deliverability, and shipping SaaS products with Next.js. In the meantime, the projects and outreach stack pages cover how I work.",
  primaryLabel: "See selected work",
  secondaryLabel: "Get in touch",
} as const;
