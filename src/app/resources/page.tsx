import type { Metadata } from "next";
import { LuArrowUpRight, LuInfo } from "react-icons/lu";

import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { AffiliateLink } from "@/components/ui/AffiliateLink";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import {
  affiliateDisclosure,
  affiliateTools,
  resourcesPage,
} from "@/data/resources";

export const metadata: Metadata = {
  /* Absolute: this page's approved SEO title already carries the brand. */
  title: { absolute: resourcesPage.seoTitle },
  description: resourcesPage.metaDescription,
  alternates: { canonical: "/resources" },
  openGraph: {
    type: "article",
    url: "/resources",
    title: resourcesPage.seoTitle,
    description: resourcesPage.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: resourcesPage.seoTitle,
    description: resourcesPage.metaDescription,
  },
};

export default function ResourcesPage() {
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
              {resourcesPage.label}
            </p>
            <h1 className="type-display text-ink mt-5 max-w-4xl text-balance">
              {resourcesPage.heading}
            </h1>
            <div className="mt-8 space-y-5">
              {resourcesPage.intro.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-ink-muted max-w-prose leading-relaxed md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Container>
        </header>

        <Section id="tools" tone="canvasAlt" labelledBy="tools-heading">
          <h2 id="tools-heading" className="sr-only">
            Recommended tools
          </h2>

          <ul className="grid auto-rows-fr gap-6 md:grid-cols-3">
            {affiliateTools.map((tool) => (
              <li key={tool.id} className="h-full" data-reveal>
                <div className="border-hairline bg-surface flex h-full flex-col border p-7">
                  <p className="text-ink-muted text-xs font-semibold tracking-[0.16em] uppercase">
                    {tool.category}
                  </p>
                  <h3 className="font-heading text-ink mt-4 text-2xl tracking-tight">
                    {tool.name}
                  </h3>
                  <p className="font-heading text-ink/70 mt-2 leading-snug font-normal italic">
                    {tool.heading}
                  </p>
                  <p className="text-ink-muted mt-5 text-sm leading-relaxed">
                    {tool.description}
                  </p>

                  <h4 className="font-body text-ink-muted mt-6 text-xs font-semibold tracking-[0.16em] uppercase">
                    What I use it for
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {tool.usedFor.map((item) => (
                      <li
                        key={item}
                        className="text-ink flex items-start gap-2.5 text-sm"
                      >
                        <span
                          aria-hidden="true"
                          className="bg-action mt-2 size-1 shrink-0 rounded-full"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <AffiliateLink href={tool.href} tool={tool.name} fullWidth>
                      {tool.ctaLabel}
                      <LuArrowUpRight className="size-4" aria-hidden="true" />
                      <span className="sr-only">
                        {" "}
                        (affiliate link, opens in a new tab)
                      </span>
                    </AffiliateLink>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Kept adjacent to the cards, per the content brief. */}
          <p
            className="border-hairline bg-canvas text-ink-muted mt-6 flex items-start gap-3 border p-5 text-sm leading-relaxed"
            data-reveal
          >
            <LuInfo
              className="text-action mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <span>
              <strong className="text-ink font-medium">Disclosure:</strong>{" "}
              {affiliateDisclosure}
            </span>
          </p>
        </Section>

        <Section id="comparison" labelledBy="comparison-heading">
          <h2
            id="comparison-heading"
            className="type-section text-ink text-balance"
            data-reveal
          >
            {resourcesPage.comparisonHeading}
          </h2>

          {/*
           * Scrolls inside itself so the page body never scrolls sideways.
           * `tabIndex` makes that scroll reachable by keyboard, which WCAG
           * requires of any scrollable region.
           */}
          <div
            className="focus-visible:outline-action mt-10 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2"
            tabIndex={0}
            role="region"
            aria-label="Platform comparison table"
            data-reveal
          >
            <table className="w-full min-w-2xl border-collapse text-left">
              <thead>
                <tr className="border-hairline border-b">
                  <th
                    scope="col"
                    className="text-ink-muted pb-4 pr-6 text-xs font-semibold tracking-[0.16em] uppercase"
                  >
                    Platform
                  </th>
                  <th
                    scope="col"
                    className="text-ink-muted pb-4 pr-6 text-xs font-semibold tracking-[0.16em] uppercase"
                  >
                    Best suited for
                  </th>
                  <th
                    scope="col"
                    className="text-ink-muted pb-4 text-xs font-semibold tracking-[0.16em] uppercase"
                  >
                    What I use it for
                  </th>
                </tr>
              </thead>
              <tbody>
                {affiliateTools.map((tool) => (
                  <tr key={tool.id} className="border-hairline border-b">
                    <th
                      scope="row"
                      className="font-heading text-ink py-5 pr-6 text-lg font-bold"
                    >
                      {tool.name}
                    </th>
                    <td className="text-ink py-5 pr-6 text-sm">{tool.bestFor}</td>
                    <td className="text-ink-muted py-5 text-sm">{tool.useCase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="work-with-me" tone="canvasAlt" labelledBy="work-with-me-heading">
          <div
            className="border-hairline flex flex-col gap-8 border p-8 md:flex-row md:items-center md:justify-between md:p-12"
            data-reveal
          >
            <div className="max-w-2xl">
              <h2
                id="work-with-me-heading"
                className="font-heading text-ink text-2xl tracking-tight md:text-3xl"
              >
                {resourcesPage.cta.heading}
              </h2>
              <p className="text-ink-muted mt-4 leading-relaxed">
                {resourcesPage.cta.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href="/#services" tone="ink" size="lg">
                {resourcesPage.cta.primaryLabel}
              </ButtonLink>
              <ButtonLink href="/#contact" tone="outline" size="lg">
                {resourcesPage.cta.secondaryLabel}
              </ButtonLink>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
      <RevealOnScroll />
    </>
  );
}
