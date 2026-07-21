import { cn } from "@heroui/react";
import type { ReactNode } from "react";

import { Container } from "./Container";

interface SectionProps {
  id: string;
  children: ReactNode;
  /** Alternating band colour. `plain` skips the container for full-bleed layouts. */
  tone?: "bg" | "surface";
  className?: string;
  /** Section-level landmark labelling; points at the heading's element id. */
  labelledBy?: string;
  bleed?: boolean;
}

/**
 * Owns vertical rhythm and banding for every section on the page. Individual
 * sections must not set their own `py-*`, or the spacing scale drifts.
 */
export function Section({
  id,
  children,
  tone = "bg",
  className,
  labelledBy,
  bleed = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "py-24 md:py-32",
        tone === "surface" ? "bg-surface" : "bg-bg",
        className,
      )}
    >
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
