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
  return (
    <span
      className={cn(
        "font-heading inline-flex items-baseline leading-none tracking-[-0.02em] whitespace-nowrap",
        tone === "onDark" ? "text-on-dark" : "text-ink",
        className,
      )}
    >
      <span className="font-bold">Masum</span>
      <span className="font-normal italic">Dev</span>
      <span className="text-action" aria-hidden="true">
        .
      </span>
    </span>
  );
}
