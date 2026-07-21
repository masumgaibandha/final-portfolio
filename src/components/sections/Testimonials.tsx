import { LuArrowUpRight } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";
import { testimonials, testimonialsIntro } from "@/data/testimonials";

export function Testimonials() {
  return (
    <Section id="testimonials" tone="canvas" labelledBy="testimonials-heading">
      <SectionHeading
        label={testimonialsIntro.label}
        heading={testimonialsIntro.heading}
        headingId="testimonials-heading"
        description={testimonialsIntro.description}
        align="between"
      />

      {/*
       * `auto-rows-fr` equalises every row to the tallest card, so all cards
       * share one height rather than only matching within their own row.
       */}
      <ul className="mt-16 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className="h-full" data-reveal>
            <figure className="border-hairline flex h-full flex-col border bg-surface p-7">
              <p className="text-ink-muted text-xs font-semibold tracking-[0.16em] uppercase">
                <span className="sr-only">Reviewed on </span>
                {testimonial.source}
              </p>

              {/*
               * `break-words` keeps an unbroken URL or long token in a future
               * review from forcing the grid track wider than its column. No
               * `hyphens-auto` — it shatters ordinary words mid-line, which
               * reads as broken in a display serif setting.
               */}
              <blockquote className="text-ink mt-4 leading-relaxed break-words">
                <p>“{testimonial.quote}”</p>
              </blockquote>

              <figcaption className="border-hairline mt-auto border-t pt-5">
                <span className="text-ink block text-sm font-medium">
                  {testimonial.attribution}
                </span>
                <span className="text-ink-muted mt-1 block text-sm break-words">
                  {testimonial.context}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-10" data-reveal>
        <ButtonLink
          href={site.upworkUrl}
          tone="outline"
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          View My Upwork Profile
          <LuArrowUpRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </Section>
  );
}
