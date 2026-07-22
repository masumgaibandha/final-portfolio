"use client";

import Link from "next/link";
import { cn } from "tailwind-variants";

import { ButtonLink } from "@/components/ui/Button";
import { useNavState } from "@/components/ui/useNavState";
import { navLinks } from "@/data/site";

/**
 * Desktop primary navigation with an active state.
 *
 * The active treatment is a terracotta label plus a hairline rule underneath —
 * a filled pill would read as a button and compete with "Let's Talk", which is
 * the only real button in the header.
 */
export function NavLinks() {
  const { isActive, ariaCurrent, isContactInView } = useNavState();

  return (
    <>
      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={ariaCurrent(link.href)}
                  className={cn(
                    "focus-visible:outline-action relative rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4",
                    /* Hairline rule, drawn only when active. */
                    "after:bg-action after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:transition-transform",
                    active
                      ? "text-action after:scale-x-100"
                      : "text-ink-muted hover:text-ink after:scale-x-0",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/*
       * `action` is the shared primary-button tone, so this picks up the same
       * terracotta fill, darker hover, white label, lifted hover shadow, press
       * state and terracotta focus ring as every other primary CTA — size and
       * shape are unchanged.
       */}
      <ButtonLink
        href="/#contact"
        tone="action"
        className="hidden sm:inline-flex"
        /* Not "active" styling — it is a button — but still announced. */
        aria-current={isContactInView ? "location" : undefined}
      >
        Let’s Talk
      </ButtonLink>
    </>
  );
}
