import { LuArrowRight, LuCheck } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services, servicesIntro } from "@/data/services";

/**
 * A bordered card grid — the same idiom as Skills and Pricing, rather than
 * the alternating full-width rows Projects uses. Services and those two
 * other sections all present short, parallel, non-visual items (a
 * technology, a tier, a capability), which a card grid presents as
 * comparable at a glance; Projects' rows exist because each one carries a
 * distinct screenshot that needs room to read.
 *
 * `grid-cols-1` is explicit on the base breakpoint rather than left to
 * default: with none, the implicit single column falls back to
 * `grid-auto-columns: auto`, which has no `minmax(0, ...)` floor — a wider
 * card's own min-content (previously the un-carded row wrapper's content)
 * can then force the whole track past the container, exactly the "clipped
 * heading" defect this replaces. `grid-cols-1`/`sm:grid-cols-2` compile to
 * `repeat(n, minmax(0, 1fr))`, giving every track an explicit zero floor so
 * cards shrink to the container and their own text wraps instead.
 *
 * `sm:auto-rows-fr` is what makes all four cards the same height, not just
 * the two in each row: with the default `auto` row sizing, each row is only
 * as tall as its own tallest card, so two rows of different content heights
 * (e.g. a 7-item vs. a 6-item list) stay visibly uneven. `auto-rows-fr`
 * makes every implicit row an `fr` track, and per the grid sizing algorithm
 * an `fr` track's used size is resolved from the single largest contribution
 * across *all* `fr` tracks in the grid — so both rows end up sized to
 * whichever card (in either row) is tallest, with no fixed pixel value
 * involved. Left off the base breakpoint on purpose: mobile is one column
 * (one card per "row"), so it would do nothing there except waste a cascade
 * entry, and the task calls for natural per-card height on mobile anyway.
 */
export function Services() {
  return (
    <Section id="services" tone="canvasAlt" labelledBy="services-heading">
      <SectionHeading
        label={servicesIntro.label}
        heading={servicesIntro.heading}
        headingId="services-heading"
      />

      <ul className="mt-16 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:auto-rows-fr">
        {services.map((service, index) => (
          <li
            key={service.id}
            className="border-hairline bg-surface card-static flex h-full min-w-0 flex-col border p-7 sm:p-8"
            data-reveal
          >
            <span
              className="text-ink-muted font-heading block text-sm"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {/* Echoes the terracotta rule on the Skills cards' category titles. */}
            <span aria-hidden="true" className="bg-action mt-3 block h-px w-8" />

            <h3 className="font-heading text-ink mt-5 text-2xl tracking-tight">
              {service.title}
            </h3>
            <p className="text-ink-muted mt-4 leading-relaxed">
              {service.summary}
            </p>

            <h4 className="font-body text-ink-muted mt-7 text-xs font-semibold tracking-[0.16em] uppercase">
              Services include
            </h4>
            {/*
             * `flex-1` lets this list absorb the slack between cards of
             * different copy length, and — paired with `mt-auto` on the CTA
             * below — is what keeps every CTA aligned along the same
             * baseline within a row, without reserving an arbitrary fixed
             * height that would clip a longer card's content instead.
             */}
            <ul className="mt-4 flex-1 space-y-3">
              {service.includes.map((item) => (
                <li
                  key={item}
                  className="flex min-w-0 items-start gap-3 text-sm"
                >
                  <LuCheck
                    className="text-action mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-ink min-w-0">{item}</span>
                </li>
              ))}
            </ul>

            {/*
             * Full width on mobile (a short, comfortable tap target edge to
             * edge) but content-width from `sm:` up, where a card this wide
             * would otherwise stretch a short label across ~460–524px and
             * read as an oversized, unbalanced pill. `fullWidth` is left off
             * `ButtonLink` (it maps to HeroUI's own `button--full-width` BEM
             * class) so `w-full sm:w-fit` — plain Tailwind utilities with no
             * competing class to out-specificity — can apply cleanly.
             */}
            <div className="mt-auto pt-8">
              <ButtonLink
                href="#contact"
                tone="outline"
                className="w-full sm:w-fit"
              >
                {service.ctaLabel}
                <LuArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
