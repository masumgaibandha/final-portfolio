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
 * Tool recommendations, not a service offering — this sits below the
 * development work so it never competes with the primary positioning.
 *
 * Rendered on the dark band as hairline-divided rows rather than cards, which
 * keeps the page from reading as four consecutive card grids.
 */
export function OutreachStack() {
  return (
    <Section id="stack" tone="dark" labelledBy="stack-heading">
      <SectionHeading
        label={outreachStackIntro.label}
        heading={outreachStackIntro.heading}
        headingId="stack-heading"
        description={outreachStackIntro.description}
        align="between"
        onDark
      />

      <ul className="mt-14">
        {affiliateTools.map((tool, index) => (
          <li
            key={tool.id}
            className={`border-on-dark/12 grid gap-6 border-t py-10 md:grid-cols-[0.8fr_1.2fr] md:gap-12 ${
              index === affiliateTools.length - 1 ? "border-b" : ""
            }`}
            data-reveal
          >
            <div>
              <p className="text-on-dark-muted text-xs font-semibold tracking-[0.16em] uppercase">
                {tool.category}
              </p>
              <h3 className="font-heading text-on-dark mt-3 text-2xl tracking-tight md:text-3xl">
                {tool.name}
              </h3>
              <p className="font-heading text-on-dark-muted mt-2 leading-snug font-normal italic">
                {tool.heading}
              </p>
              <AffiliateLink
                href={tool.href}
                tool={tool.name}
                tone="onDarkOutline"
                className="mt-6 hidden md:inline-flex"
              >
                {tool.ctaLabel}
                <LuArrowUpRight className="size-4" aria-hidden="true" />
                <span className="sr-only">
                  {" "}
                  (affiliate link, opens in a new tab)
                </span>
              </AffiliateLink>
            </div>

            <div>
              <p className="text-on-dark-muted leading-relaxed">
                {tool.description}
              </p>
              <h4 className="font-body text-on-dark-muted mt-6 text-xs font-semibold tracking-[0.16em] uppercase">
                What I use it for
              </h4>
              <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {tool.usedFor.map((item) => (
                  <li
                    key={item}
                    className="text-on-dark flex items-start gap-2.5 text-sm"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-action-dark mt-2 size-1 shrink-0 rounded-full"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <AffiliateLink
                href={tool.href}
                tool={tool.name}
                tone="onDarkOutline"
                className="mt-7 md:hidden"
              >
                {tool.ctaLabel}
                <LuArrowUpRight className="size-4" aria-hidden="true" />
                <span className="sr-only">
                  {" "}
                  (affiliate link, opens in a new tab)
                </span>
              </AffiliateLink>
            </div>
          </li>
        ))}
      </ul>

      {/* Required directly under the tools, not only in the footer. */}
      <p
        className="text-on-dark-muted mt-8 flex max-w-3xl items-start gap-3 text-sm leading-relaxed"
        data-reveal
      >
        <LuInfo
          className="text-action-dark mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        <span>
          <strong className="text-on-dark font-medium">Disclosure:</strong>{" "}
          {affiliateDisclosure}
        </span>
      </p>

      <div
        className="border-on-dark/15 mt-12 flex flex-col gap-6 border-t pt-12 md:flex-row md:items-center md:justify-between"
        data-reveal
      >
        <div className="max-w-2xl">
          <h3 className="font-heading text-on-dark text-xl tracking-tight md:text-2xl">
            {outreachStackCta.heading}
          </h3>
          <p className="text-on-dark-muted mt-3 leading-relaxed">
            {outreachStackCta.description}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <ButtonLink href="#contact" tone="onDark">
            {outreachStackCta.primaryLabel}
          </ButtonLink>
          <ButtonLink href={outreachStackCta.secondaryHref} tone="onDarkOutline">
            {outreachStackCta.secondaryLabel}
            <LuArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
