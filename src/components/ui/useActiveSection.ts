"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Reports which homepage section is currently in view, for navigation
 * highlighting.
 *
 * Returns `null` away from the homepage and at the very top of it — the logo
 * stands in for Home, so nothing in the menu should light up before the reader
 * has actually reached a section.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    /*
     * No `setActiveId` on this branch: writing state straight from an effect is
     * an extra render and what `react-hooks/set-state-in-effect` warns about.
     * Being off the homepage is already known during render, so it is derived
     * at the return instead.
     */
    if (!isHome) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0 || !("IntersectionObserver" in window)) return;

    /* Tracked outside state so a single callback can compare all entries. */
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }

        setActiveId(best);
      },
      {
        /*
         * The top offset discounts the sticky header, and several thresholds
         * let "most visible wins" resolve smoothly rather than flipping at a
         * single crossing point.
         */
        rootMargin: "-88px 0px -35% 0px",
        threshold: [0, 0.15, 0.35, 0.6, 0.9],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome, sectionIds]);

  /* Derived, so a stale id from a previous visit can never leak onto another route. */
  return isHome ? activeId : null;
}
