import { cn } from "tailwind-variants";
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
  /** Inverts the palette for the dark bands. */
  onDark?: boolean;
}

export function SectionHeading({
  label,
  heading,
  headingId,
  description,
  className,
  align = "start",
  onDark = false,
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
        <p
          className={cn(
            "flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase",
            onDark ? "text-on-dark-muted" : "text-ink-muted",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-px w-8 shrink-0",
              onDark ? "bg-action-dark" : "bg-action",
            )}
          />
          {label}
        </p>
        <h2
          id={headingId}
          className={cn(
            "type-section mt-5 text-balance",
            onDark ? "text-on-dark" : "text-ink",
          )}
        >
          {heading}
        </h2>
      </div>
      {description ? (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed md:text-lg",
            onDark ? "text-on-dark-muted" : "text-ink-muted",
            align === "between"
              ? "lg:mt-0 lg:max-w-sm lg:text-base"
              : "max-w-prose",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
