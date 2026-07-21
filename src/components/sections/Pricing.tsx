import { cn } from "@heroui/react";
import { LuArrowRight, LuCheck } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { outreachQuote, pricingIntro, pricingTiers } from "@/data/pricing";

export function Pricing() {
  return (
    <Section id="pricing" tone="surface" labelledBy="pricing-heading">
      <SectionHeading
        label={pricingIntro.label}
        heading={pricingIntro.heading}
        headingId="pricing-heading"
        description={pricingIntro.description}
        align="between"
      />

      {/* Cards stretch to a common height so the CTAs line up across tiers. */}
      <ul className="mt-16 grid gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <li
            key={tier.id}
            className={cn(
              "flex h-full flex-col border p-8",
              tier.featured
                ? "border-ink bg-ink text-bg"
                : "border-ink/10 bg-cream",
            )}
            data-reveal
          >
            {/* Fixed height so a two-line tier name doesn't shunt its price out of line. */}
            <div className="flex items-start justify-between gap-4 lg:min-h-[3.9rem]">
              <h3
                className={cn(
                  "font-heading text-2xl tracking-tight",
                  tier.featured ? "text-bg" : "text-ink",
                )}
              >
                {tier.name}
              </h3>
              {tier.badge ? (
                <span className="bg-accent text-ink rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
                  {tier.badge}
                </span>
              ) : null}
            </div>

            <p
              className={cn(
                "mt-5 text-2xl font-semibold",
                tier.featured ? "text-bg" : "text-ink",
              )}
            >
              {tier.price}
            </p>

            <p
              className={cn(
                "mt-4 text-sm leading-relaxed",
                tier.featured ? "text-bg/70" : "text-muted",
              )}
            >
              {tier.description}
            </p>

            <ul className="mt-8 space-y-3">
              {tier.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <LuCheck
                    className="text-accent mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className={tier.featured ? "text-bg/90" : "text-ink"}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className={cn(
                "mt-auto border-t pt-6",
                tier.featured ? "border-bg/15 mt-8" : "border-ink/10 mt-8",
              )}
            >
              <p
                className={cn(
                  "text-sm",
                  tier.featured ? "text-bg/70" : "text-muted",
                )}
              >
                <span className="font-medium">Estimated timeline:</span>{" "}
                {tier.timeline}
              </p>
              <ButtonLink
                href="#contact"
                tone={tier.featured ? "accent" : "outline"}
                fullWidth
                className="mt-6"
              >
                {tier.ctaLabel}
                <LuArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>

      <div
        className="border-ink/10 mt-6 flex flex-col gap-6 border p-8 md:flex-row md:items-center md:justify-between md:p-10"
        data-reveal
      >
        <div className="max-w-2xl">
          <h3 className="font-heading text-ink text-xl tracking-tight md:text-2xl">
            {outreachQuote.heading}
          </h3>
          <p className="text-muted mt-3 leading-relaxed">
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
