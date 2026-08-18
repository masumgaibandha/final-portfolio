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
    {
      url: `${site.url}/resources`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    /*
     * Registration is open (manual bKash/Nagad/Rocket, admin-verified) — the
     * sales page is now indexable and belongs in the sitemap. The admin
     * review queue under /masterclass/admin/** stays out of both the
     * sitemap and search results (noindex + Basic Auth).
     */
    {
      url: `${site.url}/masterclass/lead-generation-cold-email`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/blog`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...posts,
    /*
     * Public, index/follow legal pages (Phase 3A). The masterclass sales
     * page itself stays out of this sitemap — it's still `noindex, nofollow`
     * until checkout is functional.
     */
    ...legalPageLinks.map((link) => ({
      url: `${site.url}${link.href}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
