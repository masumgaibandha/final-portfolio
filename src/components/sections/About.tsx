import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about, skillGroups } from "@/data/about";

export function About() {
  return (
    <Section id="about" tone="surface" labelledBy="about-heading">
      <SectionHeading
        label={about.label}
        heading={about.heading}
        headingId="about-heading"
      />

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="space-y-6" data-reveal>
          {about.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 32)}
              className={
                index === 0
                  ? "text-ink max-w-prose text-lg leading-relaxed md:text-xl"
                  : "text-muted max-w-prose leading-relaxed"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-1" data-reveal>
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="border-ink/10 bg-cream border p-6 sm:p-7"
            >
              <h3 className="font-body text-ink text-xs font-semibold tracking-[0.16em] uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-ink/10 text-muted rounded-full border px-3 py-1.5 text-[0.8rem] leading-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
