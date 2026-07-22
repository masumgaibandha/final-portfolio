import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import type { BlogPost } from "@/types";

/**
 * File-based blog. Articles are `content/blog/<slug>.mdx`; their images live in
 * `public/blog/<slug>/`.
 *
 * Server-only: this reads from disk, so it must never be imported into a
 * Client Component.
 */
const BLOG_DIR = join(process.cwd(), "content", "blog");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/*
 * Frontmatter is validated rather than trusted. A typo in a date or a missing
 * description should fail the build with the offending filename, not ship a
 * post with broken metadata or an invalid `datetime` attribute.
 */
const frontmatterSchema = z
  .object({
    title: z.string().min(1, "title is required"),
    description: z.string().min(1, "description is required"),
    publishedAt: z
      .string()
      .regex(ISO_DATE, "publishedAt must be YYYY-MM-DD")
      .refine((v) => !Number.isNaN(Date.parse(v)), "publishedAt is not a real date"),
    updatedAt: z
      .string()
      .regex(ISO_DATE, "updatedAt must be YYYY-MM-DD")
      .refine((v) => !Number.isNaN(Date.parse(v)), "updatedAt is not a real date")
      .optional(),
    coverImage: z.string().startsWith("/", "coverImage must start with /").optional(),
    coverAlt: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
  })
  /*
   * Cover rules, enforced at build time rather than left to review:
   *
   * - Every *published* article needs both a cover and its alt text. A post
   *   without one has no card art and no social preview image, and there is no
   *   fallback artwork by design — inventing a placeholder would misrepresent
   *   the piece.
   * - A draft may omit them, so a post can be written before its art exists.
   * - Any post carrying a cover needs alt text regardless of draft status: a
   *   missing description is an accessibility bug that is easy to miss once it
   *   goes out.
   *
   * `superRefine` rather than chained `.refine`s so a post missing both fields
   * reports both at once instead of one per build.
   */
  .superRefine((data, ctx) => {
    if (!data.draft) {
      if (!data.coverImage) {
        ctx.addIssue({
          code: "custom",
          path: ["coverImage"],
          message:
            "coverImage is required for published articles. Add the image to public/blog/<slug>/ and reference it as /blog/<slug>/cover.webp, or set draft: true while you finish the post.",
        });
      }
      if (!data.coverAlt) {
        ctx.addIssue({
          code: "custom",
          path: ["coverAlt"],
          message:
            "coverAlt is required for published articles. Describe what the image shows — it is read aloud by screen readers and shown when the image fails to load.",
        });
      }
      return;
    }

    if (data.coverImage && !data.coverAlt) {
      ctx.addIssue({
        code: "custom",
        path: ["coverAlt"],
        message: "coverAlt is required whenever coverImage is set.",
      });
    }
  });

/** ~200 wpm, rounded up, floored at 1 so nothing reads "0 min". */
function estimateReadingMinutes(body: string): number {
  const words = body
    /* Strip fences, tags and link syntax so markup isn't counted as prose. */
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
}

/* Returns the post and its body separately, so listings need not carry bodies. */
function readPost(fileName: string): { post: BlogPost; body: string } {
  const slug = fileName.replace(/\.mdx$/, "");
  const raw = readFileSync(join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid frontmatter in content/blog/${fileName}:\n${issues}`,
    );
  }

  return {
    post: {
      ...parsed.data,
      slug,
      readingMinutes: estimateReadingMinutes(content),
    },
    body: content,
  };
}

/*
 * Drafts are visible while developing so a post can be previewed before it goes
 * out, and excluded from production builds so it cannot leak.
 */
const includeDrafts = process.env.NODE_ENV === "development";

/** Every publishable post, newest first. */
export function getAllPosts(): BlogPost[] {
  if (!existsSync(BLOG_DIR)) return [];

  return readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readPost(file).post)
    .filter((post) => includeDrafts || !post.draft)
    /* ISO dates sort correctly as strings, newest first. */
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** A single post with its MDX body, or `null` if it is missing or hidden. */
export function getPostBySlug(
  slug: string,
): (BlogPost & { body: string }) | null {
  const fileName = `${slug}.mdx`;
  const path = join(BLOG_DIR, fileName);

  if (!existsSync(path)) return null;

  const { post, body } = readPost(fileName);
  if (post.draft && !includeDrafts) return null;

  return { ...post, body };
}

/** Slugs for `generateStaticParams`. */
export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function formatPostDate(iso: string): string {
  /* Fixed locale and UTC so server and client render identically — a
   * locale-dependent string here is a classic hydration mismatch. */
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
