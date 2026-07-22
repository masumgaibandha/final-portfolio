import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { LuArrowLeft } from "react-icons/lu";

import { mdxComponents } from "@/components/blog/mdx-components";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatPostDate, getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { site } from "@/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* Every post is prerendered at build time. */
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  const url = `/blog/${post.slug}`;

  return {
    title: { absolute: `${post.title} | ${site.name}` },
    description: post.description,
    alternates: { canonical: url },
    /* Drafts stay out of the index even if their URL is shared. */
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: [...post.tags],
      images: post.coverImage
        ? [{ url: post.coverImage, alt: post.coverAlt ?? post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: `${site.url}/blog/${post.slug}`,
    author: { "@type": "Person", name: site.fullName, url: site.url },
    ...(post.coverImage ? { image: `${site.url}${post.coverImage}` } : {}),
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
  };

  return (
    <>
      <a
        href="#main"
        className="focus:bg-ink focus:text-on-dark sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:px-5 focus:py-3 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <article>
          <header className="relative">
            <div
              aria-hidden="true"
              className="hero-wash pointer-events-none absolute inset-0 -z-10"
            />
            <Container className="pt-14 pb-12 md:pt-16 md:pb-14">
              <p className="text-ink-muted text-xs font-semibold tracking-[0.18em] uppercase">
                <time dateTime={post.publishedAt}>
                  {formatPostDate(post.publishedAt)}
                </time>
                {" · "}
                {post.readingMinutes} min read
                {post.draft ? (
                  <span className="bg-accent text-accent-ink ml-3 rounded-full px-2.5 py-1 text-[0.65rem] tracking-normal normal-case">
                    Draft
                  </span>
                ) : null}
              </p>

              <h1 className="type-section text-ink mt-5 max-w-3xl text-balance">
                {post.title}
              </h1>

              <p className="text-ink-muted mt-6 max-w-prose leading-relaxed md:text-lg">
                {post.description}
              </p>

              {post.tags.length > 0 ? (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-hairline text-ink-muted rounded-full border px-3 py-1.5 text-xs font-medium"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Container>
          </header>

          {post.coverImage ? (
            <Container className="pb-4">
              <div className="border-hairline bg-canvas-alt overflow-hidden border">
                <Image
                  src={post.coverImage}
                  alt={post.coverAlt ?? ""}
                  width={1200}
                  height={630}
                  priority
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            </Container>
          ) : null}

          <Container className="pt-10 pb-24 md:pb-32">
            {/* `max-w-prose` keeps line length readable regardless of viewport. */}
            <div className="max-w-prose">
              <MDXRemote source={post.body} components={mdxComponents} />
            </div>

            <div className="border-hairline mt-16 max-w-prose border-t pt-8">
              <ButtonLink href="/blog" tone="outline">
                <LuArrowLeft className="size-4" aria-hidden="true" />
                Back to all posts
              </ButtonLink>
            </div>
          </Container>
        </article>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        // Author-controlled frontmatter, serialised — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  );
}
