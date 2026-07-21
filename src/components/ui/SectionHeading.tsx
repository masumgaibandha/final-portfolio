import { cn } from "@heroui/react";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** Small caps label above the heading, e.g. "Selected Work". */
  label: string;
  heading: ReactNode;
  /** Rendered as the section's accessible name target. */
  headingId: string;
  description?: string;
  className?: string;
  align?: "start" | "between";
}

export function SectionHeading({
  label,
  heading,
  headingId,
  description,
  className,
  align = "start",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "between"
          ? "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          : "max-w-3xl",
        className,
      )}
      data-reveal
    >
      <div className={align === "between" ? "max-w-2xl" : undefined}>
        <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-muted uppercase">
          <span
            aria-hidden="true"
            className="bg-accent h-px w-8 shrink-0"
          />
          {label}
        </p>
        <h2 id={headingId} className="text-section text-ink mt-5 text-balance">
          {heading}
        </h2>
      </div>
      {description ? (
        <p
          className={cn(
            "text-muted mt-6 text-base leading-relaxed md:text-lg",
            align === "between" ? "lg:mt-0 lg:max-w-sm lg:text-base" : "max-w-prose",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
