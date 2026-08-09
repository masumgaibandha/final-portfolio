import { cn } from "tailwind-variants";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

export type MasterclassSectionTone = "canvas" | "canvasAlt" | "dark";

const toneClasses: Record<MasterclassSectionTone, string> = {
  canvas: "bg-canvas",
  canvasAlt: "bg-canvas-alt",
  dark: "bg-ink text-on-dark",
};

interface MasterclassSectionProps {
  id: string;
  children: ReactNode;
  tone?: MasterclassSectionTone;
  className?: string;
  labelledBy?: string;
}

/**
 * Tighter vertical rhythm than the homepage's `Section` (`py-24 md:py-32`) —
 * a sales page reads faster and denser than the editorial portfolio. Kept
 * local to `masterclass/` rather than changing the shared component.
 */
export function MasterclassSection({
  id,
  children,
  tone = "canvas",
  className,
  labelledBy,
}: MasterclassSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-14 md:py-20", toneClasses[tone], className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

export const eyebrowClass =
  "text-ink-muted flex items-center gap-3 text-xs font-semibold tracking-[0.14em] uppercase";

export const eyebrowDotClass = "bg-action h-px w-8 shrink-0";
