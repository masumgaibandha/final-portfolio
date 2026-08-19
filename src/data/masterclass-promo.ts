/**
 * Homepage-facing promotional copy for the masterclass — distinct from
 * `src/data/masterclass-content.ts`, which is the Bengali content for the
 * masterclass sales page itself. This file only feeds the announcement bar,
 * hero tertiary CTA, and homepage promo section; pricing numbers are never
 * duplicated here — components pull `earlyBirdPriceBDT`/`regularPriceBDT`
 * directly from `@/lib/masterclass/constants` so a future price change can't
 * drift between the sales page and the homepage promotion.
 */

export const masterclassPath = "/masterclass/lead-generation-cold-email";
export const masterclassRegistrationHref = `${masterclassPath}#registration`;

export const announcementBar = {
  text: "2-Day Live Masterclass: Lead Generation & Cold Email Outreach",
  textShort: "2-Day Live Masterclass",
  ctaLabel: "View Masterclass",
};

export const heroMasterclassCta = {
  label: "Join the Masterclass",
};

export const masterclassPromoSection = {
  label: "2-Day Live Masterclass",
  heading: "Lead Generation & Cold Email Outreach",
  description:
    "Practical training covering prospecting, cold email systems, tools, deliverability, and real-world workflows.",
  highlights: ["Live, 2 Days", "Bangla", "Limited Registration"],
  ctaLabel: "View Masterclass",
} as const;
