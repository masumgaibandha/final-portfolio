"use client";

import { useEffect, useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";

import { buttonClass } from "@/components/ui/Button";
import { navLinks } from "@/data/site";

/**
 * The only interactive part of the header, kept as a leaf client component so
 * the rest of the navbar stays server-rendered.
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

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
          className="border-ink/8 bg-bg fixed inset-x-0 top-20 bottom-0 z-40 border-t lg:hidden"
        >
          <nav aria-label="Mobile" className="h-full overflow-y-auto px-6 py-8">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href} className="border-ink/8 border-b">
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-heading text-ink focus-visible:outline-accent block py-5 text-2xl focus-visible:outline-2 focus-visible:-outline-offset-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className={buttonClass({
                tone: "ink",
                size: "lg",
                fullWidth: true,
                className: "mt-8",
              })}
            >
              Let’s Talk
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
