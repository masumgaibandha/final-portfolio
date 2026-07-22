"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import { cn } from "tailwind-variants";

import { buttonClass } from "@/components/ui/Button";
import { useNavState } from "@/components/ui/useNavState";
import { navLinks } from "@/data/site";

/**
 * The mobile menu. Shares `useNavState` with the desktop list so both mark the
 * same link active from the same observer logic.
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { isActive, ariaCurrent, isContactInView } = useNavState();

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
        className={buttonClass({
          tone: "outline",
          className: "size-11 px-0 lg:hidden",
        })}
      >
        {isOpen ? (
          <LuX className="size-5" aria-hidden="true" />
        ) : (
          <LuMenu className="size-5" aria-hidden="true" />
        )}
      </button>

      {isOpen ? (
        <div
          id="mobile-nav-panel"
          className="border-hairline bg-canvas fixed inset-x-0 top-20 bottom-0 z-40 border-t lg:hidden"
        >
          <nav aria-label="Mobile" className="h-full overflow-y-auto px-6 py-8">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href} className="border-hairline border-b">
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={ariaCurrent(link.href)}
                    className={cn(
                      "font-heading focus-visible:outline-action block py-5 text-2xl focus-visible:outline-2 focus-visible:-outline-offset-2",
                      isActive(link.href) ? "text-action" : "text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        /* Same hairline rule as desktop, sized to the label. */
                        "relative inline-block",
                        isActive(link.href) &&
                          "after:bg-action after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full",
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              aria-current={isContactInView ? "location" : undefined}
              className={buttonClass({
                tone: "ink",
                size: "lg",
                fullWidth: true,
                className: "mt-8",
              })}
            >
              Let’s Talk
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
