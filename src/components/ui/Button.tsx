import { buttonVariants } from "@heroui/react/button";
import { cn } from "tailwind-variants";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonTone =
  | "action"
  | "ink"
  | "outline"
  | "quiet"
  /** For use on the dark bands, where terracotta needs lightening. */
  | "onDark"
  | "onDarkOutline";

const toneClasses: Record<ButtonTone, string> = {
  action:
    "bg-action text-white hover:bg-action-hover active:bg-action-hover shadow-[0_1px_2px_rgb(26_24_21/0.10)] hover:shadow-[0_8px_18px_-8px_rgb(180_70_42/0.55)]",
  ink: "bg-ink text-on-dark hover:bg-ink/88",
  outline:
    "border border-hairline text-ink bg-transparent hover:border-action hover:text-action",
  quiet: "text-ink bg-transparent hover:text-action",
  /*
   * Ink text on the lightened terracotta, not white: white on #D4674A is only
   * ~3.5:1, whereas ink reaches ~5.1:1. Hover brightens rather than darkening,
   * since a darker terracotta would sink into the dark band.
   */
  onDark:
    "bg-action-dark text-ink hover:brightness-110 active:brightness-95 shadow-[0_8px_18px_-10px_rgb(0_0_0/0.6)]",
  onDarkOutline:
    "border border-on-dark/25 text-on-dark bg-transparent hover:border-action-dark hover:text-action-dark",
};

const sizeClasses = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
} as const;

/*
 * Shared by every button and button-styled link:
 * - a visible terracotta focus ring on every interactive element
 * - a 1px lift on press so the control feels physical
 * - both suppressed under prefers-reduced-motion
 *
 * `focus-visible:outline-solid` is required, not redundant with the width/
 * color/offset utilities below: HeroUI's own `.button` base class (from
 * `@heroui/styles`, applied via `buttonVariants()`) sets `outline-none`
 * unconditionally — it expects its own `<Button>` runtime (react-aria's
 * `data-focus-visible` attribute) to drive a `box-shadow`-based ring instead.
 * `ButtonLink` renders a plain `next/link` styled with these classes, not
 * HeroUI's actual `<Button>`, so that mechanism never activates — without an
 * explicit `outline-style` override here, `outline-2`/`outline-action`/
 * `outline-offset-2` only ever set width/color/offset on an outline whose
 * style stays permanently `none`, silently invisible. Confirmed empirically:
 * removing this class visually and via `getComputedStyle` on every button-
 * styled control (nav CTA, hero CTAs, all service/pricing CTAs, submit
 * button) reproduces the invisible-focus-ring bug; adding it back fixes it.
 */
const interactionClasses = cn(
  "rounded-full font-medium",
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out",
  "focus-visible:outline-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid",
  "active:translate-y-px",
  "motion-reduce:transition-none motion-reduce:active:translate-y-0",
);

interface ButtonStyleOptions {
  tone?: ButtonTone;
  size?: keyof typeof sizeClasses;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Composes HeroUI's button geometry with the brand tones. HeroUI's own
 * `variant` colours are bypassed because the design calls for terracotta and
 * ink pills, which HeroUI has no equivalent for.
 */
export function buttonClass({
  tone = "action",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    buttonVariants({ variant: "ghost", fullWidth }),
    interactionClasses,
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
