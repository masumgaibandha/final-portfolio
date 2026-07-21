import { LuDownload } from "react-icons/lu";

import { buttonClass } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about, skillGroups } from "@/data/about";
import { site } from "@/data/site";

export function About() {
  return (
    <Section id="about" tone="canvasAlt" labelledBy="about-heading">
      <SectionHeading
        label={about.label}
        heading={about.heading}
        headingId="about-heading"
      />

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div data-reveal>
          <div className="space-y-6">
            {about.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 32)}
                className={
                  index === 0
                    ? "text-ink max-w-prose text-lg leading-relaxed md:text-xl"
                    : "text-ink-muted max-w-prose leading-relaxed"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/*
           * A plain anchor, not next/link: `download` on a static asset should
           * hit the file directly rather than go through the client router.
           * The file type and size are announced for screen readers, since
           * "Download" alone doesn't say what is about to arrive.
           */}
          <a
            href={site.resumeUrl}
            download
            className={buttonClass({ tone: "outline", className: "mt-8" })}
          >
            <LuDownload className="size-4" aria-hidden="true" />
            Download Résumé
            <span className="sr-only"> (PDF)</span>
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1" data-reveal>
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="border-hairline bg-surface card-static border p-6 sm:p-7"
            >
              <h3 className="font-body text-ink text-xs font-semibold tracking-[0.16em] uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-hairline text-ink-muted rounded-full border px-3 py-1.5 text-[0.8rem] leading-none"
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
