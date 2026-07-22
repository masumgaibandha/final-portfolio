import type { MetadataRoute } from "next";

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
    {
      url: `${site.url}/blog`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...posts,
  ];
}
