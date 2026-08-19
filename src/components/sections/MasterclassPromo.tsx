import { LuArrowRight, LuCheck } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { masterclassPath, masterclassPromoSection } from "@/data/masterclass-promo";
import { earlyBirdPriceBDT, regularPriceBDT } from "@/lib/masterclass/constants";

/**
 * A single compact promo band, not a second sales page — full curriculum,
 * proof, and checkout live at `masterclassPath`. Sits between OutreachStack
 * (tools) and Pricing (freelance rates) so this reads as one more thing I
 * offer alongside development work, without interrupting the Pricing →
 * Contact sequence that closes the page.
 */
export function MasterclassPromo() {
  return (
    <Section id="masterclass" tone="canvasAlt" labelledBy="masterclass-promo-heading">
      <div
        className="border-hairline bg-surface flex flex-col gap-8 border p-8 md:flex-row md:items-center md:justify-between md:p-10"
        data-reveal
      >
        <div className="max-w-2xl">
          <p className="text-ink-muted flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
            <span aria-hidden="true" className="bg-action h-px w-8 shrink-0" />
            {masterclassPromoSection.label}
          </p>
          <h2
            id="masterclass-promo-heading"
            className="font-heading text-ink mt-5 text-2xl tracking-tight text-balance md:text-3xl"
          >
            {masterclassPromoSection.heading}
          </h2>
          <p className="text-ink-muted mt-4 max-w-prose leading-relaxed">
            {masterclassPromoSection.description}
          </p>

          <ul className="text-ink mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li className="flex items-center gap-2">
              <LuCheck className="text-action size-4 shrink-0" aria-hidden="true" />
              Early Bird: ৳{earlyBirdPriceBDT.toLocaleString("en-US")}
            </li>
            <li className="flex items-center gap-2">
              <LuCheck className="text-action size-4 shrink-0" aria-hidden="true" />
              Regular: ৳{regularPriceBDT.toLocaleString("en-US")}
            </li>
            {masterclassPromoSection.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <LuCheck className="text-action size-4 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ButtonLink href={masterclassPath} tone="ink" size="lg" className="shrink-0">
          {masterclassPromoSection.ctaLabel}
          <LuArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </Section>
  );
}
