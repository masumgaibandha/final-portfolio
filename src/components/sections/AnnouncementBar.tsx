"use client";

import Link from "next/link";
import { useState } from "react";
import { LuX } from "react-icons/lu";

import { earlyBirdPriceBDT } from "@/lib/masterclass/constants";
import { announcementBar, masterclassPath } from "@/data/masterclass-promo";

/**
 * Slim dark utility band above the sticky navbar — the same `bg-ink`/
 * `text-on-dark` treatment already used for the Footer and OutreachStack,
 * so it reads as an established part of the site rather than a bolted-on
 * banner. Dismiss is a plain `useState` with no persistence: the bar is
 * homepage-only and re-appears on the next full page load, which is the
 * simplest option that still satisfies "dismissible" without adding a
 * storage dependency for a one-page, low-stakes UI element.
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-ink text-on-dark relative">
      {/*
       * Asymmetric padding: the dismiss button only sits on the right, so a
       * matching left reservation would just waste content width for nothing.
       * The price is intentionally NOT `whitespace-nowrap` — this row is
       * allowed to wrap onto a second line on narrow phones (its own
       * `flex-wrap` + `gap-y-1` above already expect that), so nothing here
       * is forced to stay unbroken regardless of how wide a given device's
       * fallback font renders "৳" (Poppins' `latin` subset doesn't cover it).
       */}
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 pl-4 pr-11 py-2.5 text-center md:pl-6 md:pr-12">
        <p className="text-xs leading-snug font-medium sm:text-sm">
          <span className="hidden sm:inline">{announcementBar.text}</span>
          <span className="sm:hidden">{announcementBar.textShort}</span>
          {" — Early Bird ৳"}
          {earlyBirdPriceBDT.toLocaleString("en-US")}
        </p>
        <Link
          href={masterclassPath}
          className="text-action-dark hover:text-on-dark focus-visible:outline-action-dark shrink-0 rounded-sm text-xs font-semibold whitespace-nowrap underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-sm"
        >
          {announcementBar.ctaLabel}
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="text-on-dark-muted hover:text-on-dark focus-visible:outline-action-dark absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:right-4"
      >
        <LuX className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
