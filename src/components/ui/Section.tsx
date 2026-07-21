import { cn } from "tailwind-variants";
import type { ReactNode } from "react";

import { Container } from "./Container";

export type SectionTone = "canvas" | "canvasAlt" | "dark";

const toneClasses: Record<SectionTone, string> = {
  canvas: "bg-canvas",
  canvasAlt: "bg-canvas-alt",
  dark: "bg-ink text-on-dark",
};

interface SectionProps {
  id: string;
  children: ReactNode;
  tone?: SectionTone;
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
  tone = "canvas",
  className,
  labelledBy,
  bleed = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-24 md:py-32", toneClasses[tone], className)}
    >
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
