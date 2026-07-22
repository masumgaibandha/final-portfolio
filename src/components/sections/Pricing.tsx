import { cn } from "tailwind-variants";
import { LuArrowRight, LuCheck } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { outreachQuote, pricingIntro, pricingTiers } from "@/data/pricing";

export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-heading">
      <SectionHeading
        label={pricingIntro.label}
        heading={pricingIntro.heading}
        headingId="pricing-heading"
        description={pricingIntro.description}
        align="between"
      />

      {/*
       * `items-stretch` (the grid default) plus `h-full` on each card gives the
       * three tiers a common height without a fixed one, so mobile still sizes
       * to content and cannot overflow.
       */}
      <ul className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <li
            key={tier.id}
            className={cn(
              "flex h-full flex-col border p-8",
              tier.featured
                ? "border-ink bg-ink text-on-dark"
                : "border-hairline bg-surface",
            )}
            data-reveal
          >
            {/*
             * Reserved heights on the title and description, applied only from
             * `lg` where the three columns sit side by side. Without them a
             * two-line tier name pushes that card's price, features and CTA out
             * of line with its neighbours. On mobile the cards stack, so the
             * reservations are dropped rather than leaving dead space.
             */}
            <div className="flex items-start justify-between gap-4 lg:min-h-[3.75rem]">
              <h3
                className={cn(
                  "font-heading text-2xl tracking-tight",
                  tier.featured ? "text-on-dark" : "text-ink",
                )}
              >
                {tier.name}
              </h3>
              {/*
               * Pale yellow earns its keep here: ink-on-terracotta is only
               * ~2.8:1. `items-start` keeps the badge out of the title's flow,
               * so its presence cannot shift anything below.
               */}
              {tier.badge ? (
                <span className="bg-accent text-accent-ink rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
                  {tier.badge}
                </span>
              ) : null}
            </div>

            <p
              className={cn(
                "mt-5 text-2xl font-semibold",
                tier.featured ? "text-on-dark" : "text-ink",
              )}
            >
              {tier.price}
            </p>

            <p
              className={cn(
                "mt-4 text-sm leading-relaxed lg:min-h-[4.3rem]",
                tier.featured ? "text-on-dark-muted" : "text-ink-muted",
              )}
            >
              {tier.description}
            </p>

            {/* `flex-1` lets the feature list absorb the slack between cards. */}
            <ul className="mt-8 flex-1 space-y-3">
              {tier.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <LuCheck
                    className="text-action mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className={tier.featured ? "text-on-dark/90" : "text-ink"}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/*
             * `mt-auto` sits on its own element. Merged into the same class
             * string as `mt-8`, tailwind-merge treated them as one margin
             * utility and kept `mt-8` — which silently disabled the push and
             * left the dividers and CTAs unaligned across the three cards.
             */}
            <div className="mt-auto">
              <div
                className={cn(
                  "border-t pt-6",
                  tier.featured ? "border-on-dark/15" : "border-hairline",
                )}
              >
                {/*
                 * Two lines reserved from `lg`: at 1024 "7–10 business days"
                 * wraps while "2–4 weeks" does not, which pushed that card's
                 * divider 20px out of line with its neighbours.
                 */}
                <p
                  className={cn(
                    "text-sm lg:min-h-[2.5rem]",
                    tier.featured ? "text-on-dark-muted" : "text-ink-muted",
                  )}
                >
                  <span className="font-medium">Estimated timeline:</span>{" "}
                  {tier.timeline}
                </p>
                <ButtonLink
                  href="#contact"
                  tone={tier.featured ? "onDark" : "outline"}
                  fullWidth
                  className="mt-6"
                >
                  {tier.ctaLabel}
                  <LuArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div
        className="border-hairline mt-6 flex flex-col gap-6 border p-8 md:flex-row md:items-center md:justify-between md:p-10"
        data-reveal
      >
        <div className="max-w-2xl">
          <h3 className="font-heading text-ink text-xl tracking-tight md:text-2xl">
            {outreachQuote.heading}
          </h3>
          <p className="text-ink-muted mt-3 leading-relaxed">
            {outreachQuote.description}
          </p>
        </div>
        <ButtonLink href="#contact" tone="ink" size="lg" className="shrink-0">
          {outreachQuote.ctaLabel}
        </ButtonLink>
      </div>
    </Section>
  );
}
