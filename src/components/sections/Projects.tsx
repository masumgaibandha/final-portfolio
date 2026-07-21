import { LuArrowUpRight } from "react-icons/lu";

import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, projectsIntro } from "@/data/projects";

export function Projects() {
  return (
    <Section id="projects" labelledBy="projects-heading">
      <SectionHeading
        label={projectsIntro.label}
        heading={projectsIntro.heading}
        headingId="projects-heading"
        description={projectsIntro.description}
        align="between"
      />

      <ul className="mt-16 grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <li
            key={project.id}
            className="border-ink/10 bg-cream flex flex-col border p-8 md:p-10"
            data-reveal
          >
            <p className="text-muted text-xs font-semibold tracking-[0.16em] uppercase">
              {project.category}
            </p>

            <h3 className="font-heading text-ink mt-4 text-3xl tracking-tight">
              {project.name}
            </h3>
            <p className="font-heading text-ink/70 mt-2 text-lg font-normal italic">
              {project.heading}
            </p>

            <p className="text-muted mt-5 leading-relaxed">
              {project.description}
            </p>

            <ul className="mt-7 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="text-ink flex items-start gap-2.5 text-sm"
                >
                  <span
                    aria-hidden="true"
                    className="bg-accent mt-2 size-1 shrink-0 rounded-full"
                  />
                  {highlight}
                </li>
              ))}
            </ul>

            <ul className="mt-8 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="bg-peach text-ink rounded-full px-3 py-1.5 text-xs font-medium"
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
                        tone={link.primary ? "ink" : "outline"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        <LuArrowUpRight className="size-4" aria-hidden="true" />
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
                 * Client work with nothing public to link to, so this stays a
                 * plain note rather than a link to nowhere.
                 */
                <p className="text-muted border-ink/10 border-t pt-6 text-sm">
                  Delivered as client work —{" "}
                  <a
                    href="#contact"
                    className="text-ink decoration-accent hover:decoration-ink focus-visible:outline-accent rounded-sm font-medium underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    ask me for a walkthrough
                  </a>
                  .
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
