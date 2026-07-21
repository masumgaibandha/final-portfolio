import { buttonVariants, cn } from "@heroui/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonTone = "ink" | "accent" | "outline" | "quiet";

const toneClasses: Record<ButtonTone, string> = {
  // The dark pill from the design reference.
  ink: "bg-ink text-bg hover:bg-ink/88",
  // Orange is only ever a fill behind ink text — never orange text on white.
  accent: "bg-accent text-ink hover:bg-accent/88",
  outline: "border border-ink/15 text-ink bg-transparent hover:bg-ink/[0.04]",
  quiet: "text-ink bg-transparent hover:bg-ink/[0.04]",
};

const sizeClasses = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
} as const;

interface ButtonStyleOptions {
  tone?: ButtonTone;
  size?: keyof typeof sizeClasses;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Composes HeroUI's button geometry with the brand tones. HeroUI's own
 * `variant` colours are bypassed because the design calls for ink pills, which
 * HeroUI has no equivalent for.
 */
export function buttonClass({
  tone = "ink",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    buttonVariants({ variant: "ghost", fullWidth }),
    "rounded-full font-medium transition-colors",
    "focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-2",
    sizeClasses[size],
    toneClasses[tone],
    className,
  );
}

interface ButtonLinkProps
  extends Omit<ComponentProps<typeof Link>, "className">,
    ButtonStyleOptions {
  children: ReactNode;
}

/** Anchor styled as a button — for in-page jumps and external links. */
export function ButtonLink({
  tone,
  size,
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClass({ tone, size, fullWidth, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
