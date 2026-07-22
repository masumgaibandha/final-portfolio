import { cn } from "tailwind-variants";

interface LogoProps {
  /** `onDark` inverts the mark for the dark bands. */
  tone?: "ink" | "onDark";
  className?: string;
}

/**
 * Editorial wordmark: "Masum" set solid against "Dev" in the italic display
 * cut, closing on an accent period. One component so the navbar and footer can
 * never drift apart.
 */
export function Logo({ tone = "ink", className }: LogoProps) {
  /*
   * Terracotta for "Dev." — the dark-band variant on `onDark`, since #B4462A on
   * near-black ink only reaches 3.25:1. `--color-action-dark` is the token that
   * exists for exactly this, and lands at 4.92:1.
   */
  const accentClass = tone === "onDark" ? "text-action-dark" : "text-action";

  return (
    <span
      className={cn(
        "font-heading inline-flex items-baseline leading-none tracking-[-0.02em] whitespace-nowrap",
        tone === "onDark" ? "text-on-dark" : "text-ink",
        className,
      )}
    >
      <span className="font-bold">Masum</span>
      <span className={cn("font-normal italic", accentClass)}>Dev</span>
      <span className={accentClass} aria-hidden="true">
        .
      </span>
    </span>
  );
}
