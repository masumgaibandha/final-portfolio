import { LuMail } from "react-icons/lu";

import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactIntro } from "@/data/contact";
import { site, socialLinks } from "@/data/site";

export function Contact() {
  return (
    <Section id="contact" tone="surface" labelledBy="contact-heading">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            label={contactIntro.label}
            heading={contactIntro.heading}
            headingId="contact-heading"
          />
          <p className="text-muted mt-6 max-w-prose leading-relaxed">
            {contactIntro.description}
          </p>
          <p className="text-ink border-accent mt-6 max-w-prose border-l-2 pl-5 leading-relaxed">
            {contactIntro.guidance}
          </p>

          <div className="border-ink/10 mt-10 border-t pt-8" data-reveal>
            <p className="text-muted text-xs font-semibold tracking-[0.16em] uppercase">
              Prefer email?
            </p>
            <a
              href={`mailto:${site.email}`}
              className="text-ink decoration-accent hover:decoration-ink focus-visible:outline-accent mt-3 inline-flex items-center gap-2.5 rounded-sm text-lg font-medium underline decoration-2 underline-offset-[6px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <LuMail className="size-5" aria-hidden="true" />
              {site.email}
            </a>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-ink focus-visible:outline-accent rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal>
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
