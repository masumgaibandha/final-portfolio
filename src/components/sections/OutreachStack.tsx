import { LuArrowRight, LuArrowUpRight, LuInfo } from "react-icons/lu";

import { AffiliateLink } from "@/components/ui/AffiliateLink";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  affiliateDisclosure,
  affiliateTools,
  outreachStackCta,
  outreachStackIntro,
} from "@/data/resources";

/**
 * Tool recommendations, not a service offering — this section sits after
 * Services deliberately so it never reads as something to hire me for.
 */
export function OutreachStack() {
  return (
    <Section id="stack" tone="surface" labelledBy="stack-heading">
      <SectionHeading
        label={outreachStackIntro.label}
        heading={outreachStackIntro.heading}
        headingId="stack-heading"
        description={outreachStackIntro.description}
        align="between"
      />

      <ul className="mt-16 grid auto-rows-fr gap-6 md:grid-cols-3">
        {affiliateTools.map((tool) => (
          <li key={tool.id} className="h-full" data-reveal>
            <div className="border-ink/10 bg-cream flex h-full flex-col border p-7">
              <p className="text-muted text-xs font-semibold tracking-[0.16em] uppercase">
                {tool.category}
              </p>
              <h3 className="font-heading text-ink mt-4 text-2xl tracking-tight">
                {tool.name}
              </h3>
              <p className="font-heading text-ink/70 mt-2 leading-snug font-normal italic">
                {tool.heading}
              </p>
              <p className="text-muted mt-5 text-sm leading-relaxed">
                {tool.description}
              </p>

              <h4 className="font-body text-muted mt-6 text-xs font-semibold tracking-[0.16em] uppercase">
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
                      className="bg-accent mt-2 size-1 shrink-0 rounded-full"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                <AffiliateLink href={tool.href} tool={tool.name} fullWidth>
                  {tool.ctaLabel}
                  <LuArrowUpRight className="size-4" aria-hidden="true" />
                  <span className="sr-only"> (affiliate link, opens in a new tab)</span>
                </AffiliateLink>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Required directly below the cards, not only in the footer. */}
      <p
        className="border-ink/10 bg-bg text-muted mt-6 flex items-start gap-3 border p-5 text-sm leading-relaxed"
        data-reveal
      >
        <LuInfo className="text-accent mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="text-ink font-medium">Disclosure:</strong>{" "}
          {affiliateDisclosure}
        </span>
      </p>

      <div
        className="border-ink/10 mt-6 flex flex-col gap-6 border p-8 md:flex-row md:items-center md:justify-between md:p-10"
        data-reveal
      >
        <div className="max-w-2xl">
          <h3 className="font-heading text-ink text-xl tracking-tight md:text-2xl">
            {outreachStackCta.heading}
          </h3>
          <p className="text-muted mt-3 leading-relaxed">
            {outreachStackCta.description}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <ButtonLink href="#contact" tone="ink">
            {outreachStackCta.primaryLabel}
          </ButtonLink>
          <ButtonLink href={outreachStackCta.secondaryHref} tone="outline">
            {outreachStackCta.secondaryLabel}
            <LuArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
