"use client";

import { usePathname } from "next/navigation";

import { useActiveSection } from "@/components/ui/useActiveSection";

/*
 * Homepage sections the menu can point at. Module-level so its identity is
 * stable across renders and the observer effect does not re-run every paint.
 */
const TRACKED_SECTIONS = [
  "about",
  "services",
  "projects",
  "contact",
] as const;

export interface NavState {
  isActive: (href: string) => boolean;
  /** `page` for a distinct route, `location` for a section of the current one. */
  ariaCurrent: (href: string) => "page" | "location" | undefined;
  isContactInView: boolean;
}

export function useNavState(): NavState {
  const pathname = usePathname();
  const activeSection = useActiveSection(TRACKED_SECTIONS);

  const isActive = (href: string) => {
    /* Blog stays active across /blog and every /blog/[slug]. */
    if (href.startsWith("/blog")) {
      return pathname === "/blog" || pathname.startsWith("/blog/");
    }

    if (href.startsWith("/#")) {
      return activeSection !== null && href === `/#${activeSection}`;
    }

    return pathname === href;
  };

  const ariaCurrent = (href: string): "page" | "location" | undefined => {
    if (!isActive(href)) return undefined;
    /* A hash target is a place within the page, not a different page. */
    return href.startsWith("/#") ? "location" : "page";
  };

  return {
    isActive,
    ariaCurrent,
    isContactInView: activeSection === "contact",
  };
}
