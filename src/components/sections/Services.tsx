import { LuArrowRight, LuCheck } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services, servicesIntro } from "@/data/services";

export function Services() {
  return (
    <Section id="services" tone="canvasAlt" labelledBy="services-heading">
      <SectionHeading
        label={servicesIntro.label}
        heading={servicesIntro.heading}
        headingId="services-heading"
      />

      <ul className="mt-16 space-y-px">
        {services.map((service, index) => (
          <li
            key={service.id}
            className="border-hairline grid gap-8 border-t py-12 md:grid-cols-[0.9fr_1.1fr] md:gap-12 lg:gap-20"
            data-reveal
          >
            <div>
              <span
                className="text-ink-muted font-heading block text-sm"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading text-ink mt-3 text-2xl tracking-tight md:text-3xl">
                {service.title}
              </h3>
              <p className="text-ink-muted mt-5 max-w-prose leading-relaxed">
                {service.summary}
              </p>
              <ButtonLink
                href="#contact"
                tone="outline"
                className="mt-7 hidden md:inline-flex"
              >
                {service.ctaLabel}
                <LuArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>

            <div>
              <h4 className="font-body text-ink-muted text-xs font-semibold tracking-[0.16em] uppercase">
                Services include
              </h4>
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <LuCheck
                      className="text-action mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-ink">{item}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="#contact"
                tone="outline"
                className="mt-8 md:hidden"
              >
                {service.ctaLabel}
                <LuArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
