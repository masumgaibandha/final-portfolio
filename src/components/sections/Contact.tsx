import { LuMail } from "react-icons/lu";

import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactIntro } from "@/data/contact";
import { site, socialLinks } from "@/data/site";

export function Contact() {
  return (
    <Section id="contact" tone="canvasAlt" labelledBy="contact-heading">
      {/*
       * `grid-cols-1` is required on the base breakpoint, not just implied by
       * omitting it: without it, the implicit single column below `lg` falls
       * back to `grid-auto-columns: auto`, which has no `minmax(0, ...)`
       * floor — the same "clipped heading" root cause fixed in Pricing and
       * Services. Here it let the form column's own min-content push the
       * whole grid (and the contact form inside it) past a 280px viewport by
       * 38px. `grid-cols-1` compiles to `repeat(1, minmax(0, 1fr))`, giving
       * the track an explicit zero floor; `lg:grid-cols-[0.85fr_1.15fr]`
       * (unchanged) still takes over at `lg`. `min-w-0` on both children is
       * the matching floor one level down, since each is itself a grid item.
       */}
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="min-w-0">
          <SectionHeading
            label={contactIntro.label}
            heading={contactIntro.heading}
            headingId="contact-heading"
          />
          <p className="text-ink-muted mt-6 max-w-prose leading-relaxed">
            {contactIntro.description}
          </p>
          <p className="text-ink border-action mt-6 max-w-prose border-l-2 pl-5 leading-relaxed">
            {contactIntro.guidance}
          </p>

          <div className="border-hairline mt-10 border-t pt-8" data-reveal>
            <p className="text-ink-muted text-xs font-semibold tracking-[0.16em] uppercase">
              Prefer email?
            </p>
            {/*
             * `min-w-0 break-all` on the email itself, not just the flex
             * row: an email address has no spaces to wrap at, so as a flex
             * child its default `min-width: auto` resolves to the address's
             * full unbroken width — exactly the "unbreakable string"
             * overflow the diagnosis called out. `break-all` gives the
             * browser somewhere to wrap if the column ever gets narrower
             * than the address itself.
             */}
            <a
              href={`mailto:${site.email}`}
              className="text-ink decoration-action hover:text-action focus-visible:outline-action mt-3 inline-flex min-w-0 items-center gap-2.5 rounded-sm text-lg font-medium underline decoration-2 underline-offset-[6px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <LuMail className="size-5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 break-all">{site.email}</span>
            </a>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-muted hover:text-ink focus-visible:outline-action rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0" data-reveal>
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
