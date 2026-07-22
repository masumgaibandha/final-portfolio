import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuPenLine } from "react-icons/lu";

import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Section } from "@/components/ui/Section";
import { blogEmptyState, blogPage } from "@/data/blog";
import { formatPostDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: { absolute: blogPage.seoTitle },
  description: blogPage.metaDescription,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: blogPage.seoTitle,
    description: blogPage.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: blogPage.seoTitle,
    description: blogPage.metaDescription,
  },
};

export default function BlogPage() {
  /* Read from content/blog at build time; empty state renders when there are none. */
  const blogPosts = getAllPosts();

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
        <header className="relative">
          <div
            aria-hidden="true"
            className="hero-wash pointer-events-none absolute inset-0 -z-10"
          />
          <Container className="pt-16 pb-20 md:pt-20 md:pb-24">
            <p className="text-ink-muted flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
              <span aria-hidden="true" className="bg-action h-px w-8 shrink-0" />
              {blogPage.label}
            </p>
            <h1 className="type-display text-ink mt-5 max-w-4xl text-balance">
              {blogPage.heading}
            </h1>
            <p className="text-ink-muted mt-7 max-w-prose leading-relaxed md:text-lg">
              {blogPage.intro}
            </p>
          </Container>
        </header>

        <Section id="posts" tone="canvasAlt" labelledBy="posts-heading">
          <h2 id="posts-heading" className="sr-only">
            Posts
          </h2>

          {/* `auto-rows-fr` keeps cards level when descriptions differ in length. */}
          {blogPosts.length > 0 ? (
            <ul className="grid auto-rows-fr gap-6 md:grid-cols-2">
              {blogPosts.map((post) => (
                <li key={post.slug} data-reveal>
                  <article className="border-hairline bg-surface card-interactive flex h-full flex-col overflow-hidden border">
                    {/*
                     * Rendered only when the post actually has a cover — a
                     * placeholder would be invented art. `fill` because cover
                     * dimensions aren't known ahead of time; the 16:9 parent
                     * fixes the ratio and `object-cover` fills it without
                     * distortion.
                     */}
                    {post.coverImage ? (
                      <div className="bg-canvas-alt border-hairline relative aspect-video w-full overflow-hidden border-b">
                        <Image
                          src={post.coverImage}
                          alt={post.coverAlt ?? ""}
                          fill
                          /* Cards sit below the header on every breakpoint. */
                          loading="lazy"
                          sizes="(min-width: 1152px) 564px, (min-width: 768px) 50vw, 100vw"
                          className="object-cover object-center"
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-8">
                      <p className="text-ink-muted text-xs font-semibold tracking-[0.16em] uppercase">
                        {/* Shared formatter: fixed locale + UTC, so the server and
                            client can't disagree and trigger a hydration error. */}
                        <time dateTime={post.publishedAt}>
                          {formatPostDate(post.publishedAt)}
                        </time>
                        {" · "}
                        {post.readingMinutes} min read
                        {post.draft ? (
                          <span className="bg-accent text-accent-ink ml-2 rounded-full px-2 py-0.5 text-[0.65rem] tracking-normal normal-case">
                            Draft
                          </span>
                        ) : null}
                      </p>
                      <h3 className="font-heading text-ink mt-4 text-2xl tracking-tight">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-action focus-visible:outline-action rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-ink-muted mt-4 line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            /*
             * Honest empty state. There are no posts yet, and inventing sample
             * articles would misrepresent published work — so the page says so
             * plainly and points at the parts of the site that do have depth.
             */
            <div
              className="border-hairline bg-surface flex flex-col items-start border p-10 md:items-center md:p-16 md:text-center"
              data-reveal
            >
              <span
                aria-hidden="true"
                className="bg-accent text-accent-ink flex size-12 items-center justify-center rounded-full"
              >
                <LuPenLine className="size-5" />
              </span>
              <h3 className="font-heading text-ink mt-6 text-2xl tracking-tight md:text-3xl">
                {blogEmptyState.heading}
              </h3>
              <p className="text-ink-muted mt-4 max-w-prose leading-relaxed">
                {blogEmptyState.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/#projects" tone="action">
                  {blogEmptyState.primaryLabel}
                  <LuArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/#contact" tone="outline">
                  {blogEmptyState.secondaryLabel}
                </ButtonLink>
              </div>
            </div>
          )}
        </Section>
      </main>

      <Footer />
      <RevealOnScroll />
    </>
  );
}
