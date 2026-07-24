import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillCategories, skillsIntro } from "@/data/skills";

/**
 * Development stack, sitting between About and Services so the claims in the
 * About copy are backed before the offering is made.
 *
 * Informational only — no links, no hover lift, and no proficiency scoring.
 * A percentage or star rating against a technology is a number nobody can
 * verify, so the list stays a plain statement of what is in the toolkit.
 */
export function Skills() {
  return (
    <Section id="skills" labelledBy="skills-heading">
      <SectionHeading
        label={skillsIntro.label}
        heading={skillsIntro.heading}
        headingId="skills-heading"
        description={skillsIntro.description}
        align="between"
      />

      {/*
       * Full Container width — no inner max-width wrapper, so the three cards
       * span the same measure as every other section's content.
       *
       * `items-start` at every width: each card is only as tall as its own
       * content. Frontend carries seven rows to the others' four, and levelling
       * the bottom edges would buy that alignment with ~155px of empty card at
       * desktop and ~340px at two columns. This is an informational list, so
       * padding a category to match its neighbour is the wrong trade — the
       * ragged baseline is deliberate.
       */}
      <ul className="mt-14 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category) => (
          <li
            key={category.id}
            className="border-hairline bg-surface card-static border p-7 sm:p-8"
            data-reveal
          >
            <h3 className="font-body text-ink text-sm font-semibold tracking-[0.16em] uppercase">
              {category.title}
            </h3>
            {/* Echoes the terracotta rule on the section eyebrow above. */}
            <span aria-hidden="true" className="bg-action mt-3 block h-px w-8" />

            <ul className="mt-7 space-y-2">
              {category.skills.map((skill) => {
                const Icon = skill.icon;

                return (
                  <li
                    key={skill.name}
                    className="flex min-h-11 items-center gap-4"
                  >
                    {/*
                     * `shrink-0` plus a square `size-*` is what keeps the marks
                     * undistorted — without it a long label squeezes the icon
                     * box narrower than it is tall.
                     *
                     * Plain template string, not `cn()`: tailwind-merge would
                     * read `text-[#E34F26]` and `size-6` as one text group and
                     * drop the colour.
                     */}
                    <Icon
                      className={`${skill.iconClass} size-6 shrink-0 md:size-7`}
                      aria-hidden="true"
                    />
                    <span className="text-ink text-[0.95rem] leading-snug font-medium md:text-base">
                      {skill.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
