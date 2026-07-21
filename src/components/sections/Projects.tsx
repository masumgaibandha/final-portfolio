import Image from "next/image";
import { LuArrowUpRight } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, projectsIntro } from "@/data/projects";

export function Projects() {
  return (
    <Section id="projects" tone="canvasAlt" labelledBy="projects-heading">
      <SectionHeading
        label={projectsIntro.label}
        heading={projectsIntro.heading}
        headingId="projects-heading"
        description={projectsIntro.description}
        align="between"
      />

      {/*
       * Alternating full-width rows rather than a grid of identical cards —
       * it gives the screenshots room to read and breaks up the page's card
       * rhythm without losing the familiar structure.
       */}
      <ul className="mt-16 space-y-6">
        {projects.map((project, index) => (
          <li key={project.id} data-reveal>
            <article
              className={`border-hairline bg-surface grid overflow-hidden border ${
                project.image ? "lg:grid-cols-2" : ""
              } ${project.image ? "card-interactive" : "card-static"}`}
            >
              {/*
               * `object-contain` on a neutral panel, never `object-cover`: the
               * three sources have different native ratios (4:3, 4:3 and 5:6),
               * so any single crop box would slice one of them — it was cutting
               * the left edge off the DentFlow browser frame. Contain letterboxes
               * instead, so every screenshot is whole and undistorted. The
               * padding keeps the frame edges off the card border.
               *
               * First in DOM order, so mobile stacks the image above the copy;
               * `lg:order-2` only alternates sides once there are two columns.
               */}
              {project.image ? (
                <div
                  className={`bg-canvas-alt border-hairline relative aspect-[4/3] p-5 lg:aspect-auto lg:h-full lg:p-7 ${
                    index % 2 === 1
                      ? "lg:order-2 lg:border-l lg:border-b-0"
                      : "lg:border-r lg:border-b-0"
                  } border-b`}
                >
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    /* Below the fold at every breakpoint. */
                    loading="lazy"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="size-full object-contain object-center"
                  />
                </div>
              ) : null}

              <div className="flex flex-col p-8 md:p-10">
                <p className="text-ink-muted text-xs font-semibold tracking-[0.16em] uppercase">
                  {project.category}
                </p>

                <h3 className="font-heading text-ink mt-4 text-2xl tracking-tight md:text-3xl">
                  {project.name}
                </h3>
                <p className="font-heading text-ink/70 mt-2 text-lg font-normal italic">
                  {project.heading}
                </p>

                <p className="text-ink-muted mt-5 leading-relaxed">
                  {project.description}
                </p>

                <ul className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="text-ink flex items-start gap-2.5 text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-action mt-2 size-1 shrink-0 rounded-full"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-hairline text-ink-muted rounded-full border px-3 py-1.5 text-xs font-medium"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  {project.links.length > 0 ? (
                    <ul className="flex flex-wrap gap-3">
                      {project.links.map((link) => (
                        <li key={link.href}>
                          <ButtonLink
                            href={link.href}
                            tone={link.primary ? "action" : "outline"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                            <LuArrowUpRight
                              className="size-4"
                              aria-hidden="true"
                            />
                            <span className="sr-only">
                              {" "}
                              for {project.name} (opens in a new tab)
                            </span>
                          </ButtonLink>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    /*
                     * Client work with nothing public to link to, so this stays
                     * a plain note rather than a link to nowhere.
                     */
                    <p className="text-ink-muted border-hairline border-t pt-6 text-sm">
                      Delivered as client work —{" "}
                      <a
                        href="#contact"
                        className="text-ink hover:text-action decoration-action focus-visible:outline-action rounded-sm font-medium underline decoration-2 underline-offset-4 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4"
                      >
                        ask me for a walkthrough
                      </a>
                      .
                    </p>
                  )}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
