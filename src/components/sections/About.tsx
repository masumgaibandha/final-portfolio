import { LuDownload } from "react-icons/lu";

import { buttonClass } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/data/about";
import { site } from "@/data/site";

/**
 * Editorial text block: heading and lead across the top, the two body
 * paragraphs as equal columns beneath a hairline, and the closing line paired
 * with the résumé download.
 *
 * The skill chips that once filled a second column now have their own section —
 * so this is a single measured column rather than a two-column grid with one
 * side emptied out.
 */
export function About() {
  return (
    <Section id="about" tone="canvasAlt" labelledBy="about-heading">
      <SectionHeading
        label={about.label}
        heading={about.heading}
        headingId="about-heading"
        description={about.lead}
        align="between"
      />

      {/*
       * Two columns of near-equal length, so neither runs noticeably past the
       * other. They stack on mobile in reading order.
       */}
      <div
        className="border-hairline mt-14 grid gap-10 border-t pt-12 md:grid-cols-2 md:gap-16"
        data-reveal
      >
        {about.body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="text-ink-muted max-w-prose leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div
        className="mt-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12"
        data-reveal
      >
        <p className="text-ink max-w-2xl text-lg leading-relaxed">
          {about.closing}
        </p>

        {/*
         * A plain anchor, not next/link: `download` on a static asset should
         * hit the file directly rather than go through the client router.
         * The file type is announced for screen readers, since "Download"
         * alone doesn't say what is about to arrive.
         *
         * `self-start` keeps it at its natural width when the row stacks;
         * `md:self-auto` hands alignment back to `items-center` once it doesn't.
         */}
        <a
          href={site.resumeUrl}
          download
          className={buttonClass({
            tone: "outline",
            className: "shrink-0 self-start md:self-auto",
          })}
        >
          <LuDownload className="size-4" aria-hidden="true" />
          Download Résumé
          <span className="sr-only"> (PDF)</span>
        </a>
      </div>
    </Section>
  );
}
