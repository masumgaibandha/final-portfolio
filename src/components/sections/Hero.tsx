import Image from "next/image";
import { LuArrowDown } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hero, trustIndicators } from "@/data/hero";

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="relative">
      {/* The single permitted gradient: the warm wash behind the hero. */}
      <div
        aria-hidden="true"
        className="hero-wash pointer-events-none absolute inset-0 -z-10"
      />

      {/*
       * Vertical rhythm tightened at lg so both CTAs sit above a 1366x768
       * fold; mobile keeps its original breathing room.
       */}
      <Container className="pt-12 pb-24 md:pt-14 md:pb-28 lg:pt-10 lg:pb-24">
        {/*
         * Deliberately no `data-reveal` on the hero: it starts at opacity 0
         * until hydration runs the observer, which made the hero copy the LCP
         * element at 3.8s despite a 1.2s FCP. Above-the-fold content paints
         * immediately; the reveal is for what you scroll to.
         */}
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <p className="text-ink-muted text-sm font-medium tracking-[0.14em] uppercase">
              {hero.eyebrow}
            </p>

            <h1
              id="hero-heading"
              className="type-display text-ink mt-5 text-balance"
            >
              {hero.headline}
              <span className="font-heading block font-normal italic">
                {hero.headlineAccent}
              </span>
            </h1>

            {/* Body stays at 16/17px — readable, not shrunk to buy space. */}
            <p className="text-ink-muted mt-6 max-w-prose text-base leading-relaxed lg:text-[1.0625rem]">
              {hero.description}
            </p>

            {/* Two actions only — the résumé now lives in About, below the summary. */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="#projects" tone="action" size="lg">
                View My Projects
                <LuArrowDown className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#contact" tone="outline" size="lg">
                Start a Project
              </ButtonLink>
            </div>
          </div>

          {/*
           * The portrait ships with its own warm backdrop baked in, so it sits
           * inside a matching panel rather than being cut out — a hard edge
           * against the page would read as a mistake. Cropped to a portrait
           * ratio because the 4:3 source leaves the subject too small.
           */}
          <div className="relative">
            <div className="border-hairline bg-canvas-alt relative aspect-[4/5] overflow-hidden rounded-[2rem] border sm:aspect-square lg:aspect-[4/5]">
              <Image
                src="/masum.webp"
                alt="Abdullah Al Masum, full-stack developer and B2B outreach specialist"
                width={1100}
                height={825}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 90vw, 100vw"
                className="size-full object-cover object-[center_20%]"
              />
            </div>

            <p className="border-hairline bg-surface absolute bottom-5 left-5 inline-flex items-center gap-2.5 rounded-full border py-2.5 pr-5 pl-4 text-xs font-medium shadow-[0_2px_8px_-4px_rgb(26_24_21/0.15)] sm:text-sm">
              <span
                aria-hidden="true"
                className="bg-action size-2 shrink-0 rounded-full"
              />
              {hero.availability}
            </p>
          </div>
        </div>

        {/* Trust indicators — factual Upwork numbers, set as an editorial strip. */}
        <dl
          className="border-hairline mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t pt-10 md:grid-cols-4"
          data-reveal
        >
          {trustIndicators.map((indicator) => (
            <div key={indicator.label}>
              <dt className="sr-only">{indicator.label}</dt>
              <dd>
                <span className="font-heading text-ink block text-3xl tracking-tight md:text-4xl">
                  {indicator.value}
                </span>
                <span className="text-ink-muted mt-2 block text-sm">
                  {indicator.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
