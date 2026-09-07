import type { MetadataRoute } from "next";

import { legalPageLinks } from "@/data/legal-content";
import { site } from "@/data/site";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  /* Only published posts; drafts are already filtered out by getAllPosts. */
  const posts: MetadataRoute.Sitemap = getAllPosts()
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00Z`),
      changeFrequency: "yearly",
      priority: 0.6,
    }));

  return [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    /*
     * The Lead Generation & Cold Email Outreach masterclass is not listed
     * here: `next.config.ts` permanently redirects
     * `/masterclass/lead-generation-cold-email` (and the legacy pluralized
     * path) to Outbound BD's own page, so there is no longer a MasumDev URL
     * for this content to point search engines at. See CLAUDE.md
     * "Masterclass de-promotion".
     */
    {
      url: `${site.url}/blog`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...posts,
    /* Public, index/follow legal pages (Phase 3A). */
    ...legalPageLinks.map((link) => ({
      url: `${site.url}${link.href}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
