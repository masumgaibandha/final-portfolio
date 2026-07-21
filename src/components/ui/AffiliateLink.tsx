"use client";

import type { ReactNode } from "react";

import { buttonClass, type ButtonTone } from "@/components/ui/Button";

/**
 * The single route by which an affiliate URL may reach the page.
 *
 * `rel` and `target` are hardcoded rather than passed in, so no call site can
 * accidentally ship a monetised link without `sponsored nofollow` — which is
 * what search engines require for paid endorsements.
 */
const AFFILIATE_REL = "sponsored nofollow noopener noreferrer";

interface AffiliateLinkProps {
  href: string;
  /** Tool name, sent as the analytics event property. */
  tool: string;
  tone?: ButtonTone;
  size?: "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

interface AnalyticsWindow extends Window {
  gtag?: (
    command: "event",
    name: string,
    params: Record<string, unknown>,
  ) => void;
  dataLayer?: Record<string, unknown>[];
}

export function AffiliateLink({
  href,
  tool,
  tone = "outline",
  size = "md",
  fullWidth,
  className,
  children,
}: AffiliateLinkProps) {
  /*
   * No analytics provider is installed yet. This reports to gtag or dataLayer
   * if either is present later and is otherwise a no-op, so adding analytics
   * needs no change here — and navigation is never blocked on it.
   */
  const track = () => {
    try {
      const w = window as AnalyticsWindow;
      if (typeof w.gtag === "function") {
        w.gtag("event", "affiliate_tool_click", { tool_name: tool });
      } else if (Array.isArray(w.dataLayer)) {
        w.dataLayer.push({ event: "affiliate_tool_click", tool_name: tool });
      }
    } catch {
      /* Analytics must never break an outbound click. */
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel={AFFILIATE_REL}
      onClick={track}
      className={buttonClass({ tone, size, fullWidth, className })}
    >
      {children}
    </a>
  );
}
