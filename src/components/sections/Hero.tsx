import Image from "next/image";
import { LuArrowDown, LuArrowUpRight } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hero, trustIndicators } from "@/data/hero";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="relative">
      {/* The single permitted gradient: the warm wash behind the hero. */}
      <div
        aria-hidden="true"
        className="hero-wash pointer-events-none absolute inset-0 -z-10"
      />

      <Container className="pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div data-reveal>
            <p className="text-muted text-sm font-medium tracking-[0.14em] uppercase">
              {hero.eyebrow}
            </p>

            <h1
              id="hero-heading"
              className="text-display text-ink mt-6 text-balance"
            >
              {hero.headline}
              <span className="font-heading block font-normal italic">
                {hero.headlineAccent}
              </span>
            </h1>

            <p className="text-muted mt-8 max-w-prose text-base leading-relaxed md:text-lg">
              {hero.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="#projects" tone="ink" size="lg">
                View My Projects
                <LuArrowDown className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#contact" tone="outline" size="lg">
                Start a Project
              </ButtonLink>
              <a
                href={site.resumeUrl}
                download
                className="text-ink decoration-accent hover:decoration-ink focus-visible:outline-accent inline-flex items-center gap-1.5 rounded-sm text-sm font-medium underline decoration-2 underline-offset-[6px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Download My Résumé
                <LuArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/*
           * The portrait ships with its own warm backdrop baked in, so it sits
           * inside a matching panel rather than being cut out — a hard edge
           * against the page would read as a mistake.
           */}
          <div className="relative" data-reveal>
            {/*
             * The source is 4:3 with wide empty margins, so it is cropped to a
             * portrait ratio — otherwise the subject reads far too small in the
             * column.
             */}
            <div className="border-ink/8 bg-cream relative aspect-[4/5] overflow-hidden rounded-[2rem] border sm:aspect-[5/5] lg:aspect-[4/5]">
              <Image
                src="/masum.png"
                alt="Abdullah Al Masum, full-stack developer and B2B outreach specialist"
                width={1448}
                height={1086}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="size-full object-cover object-[center_20%]"
              />
            </div>

            <p className="border-ink/8 bg-bg absolute bottom-5 left-5 inline-flex items-center gap-2.5 rounded-full border py-2.5 pr-5 pl-4 text-xs font-medium sm:text-sm">
              <span
                aria-hidden="true"
                className="bg-accent size-2 shrink-0 rounded-full"
              />
              {hero.availability}
            </p>
          </div>
        </div>

        {/* Trust indicators — factual Upwork numbers, set as an editorial strip. */}
        <dl
          className="border-ink/10 mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t pt-10 md:grid-cols-4"
          data-reveal
        >
          {trustIndicators.map((indicator) => (
            <div key={indicator.label}>
              <dt className="sr-only">{indicator.label}</dt>
              <dd>
                <span className="font-heading text-ink block text-3xl tracking-tight md:text-4xl">
                  {indicator.value}
                </span>
                <span className="text-muted mt-2 block text-sm">
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
