import { LuArrowUpRight } from "react-icons/lu";

import { TestimonialCard } from "@/components/TestimonialCard";
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
       * share one height rather than only matching within their own row. Each
       * card clamps its quote to three lines and offers the full text in a
       * dialog — see TestimonialCard.
       */}
      <ul className="mt-16 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className="h-full" data-reveal>
            <TestimonialCard testimonial={testimonial} />
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
