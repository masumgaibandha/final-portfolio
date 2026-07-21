import type { PricingTier } from "@/types";

export const pricingIntro = {
  label: "Pricing",
  heading: "Development Packages",
  description:
    "Transparent starting points for development work. Every project has different requirements, so final pricing and delivery time are confirmed after reviewing the complete scope.",
} as const;

export const pricingTiers: readonly PricingTier[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    price: "Starting at $750",
    description:
      "For professionals and small businesses that need a focused, conversion-oriented online presence.",
    includes: [
      "One custom landing page",
      "Up to six sections",
      "Responsive development",
      "Contact or lead form",
      "Basic SEO metadata",
      "Performance checks",
      "Deployment assistance",
      "Two revision rounds",
    ],
    timeline: "7–10 business days",
    ctaLabel: "Choose Basic",
  },
  {
    id: "business-website",
    name: "Business Website",
    price: "Starting at $2,000",
    description:
      "For businesses that need a complete website to present their services, work, and expertise.",
    includes: [
      "Up to seven custom pages",
      "Responsive UI development",
      "Contact and inquiry forms",
      "Basic CMS or database integration",
      "Analytics integration",
      "On-page SEO setup",
      "Performance optimization",
      "Three revision rounds",
      "Deployment assistance",
    ],
    timeline: "2–4 weeks",
    ctaLabel: "Choose Standard",
    badge: "Most Popular",
    featured: true,
  },
  {
    id: "custom-web-application",
    name: "Custom Web Application",
    price: "Starting at $5,000",
    description:
      "For businesses and founders building a custom SaaS product, dashboard, marketplace, or MVP.",
    includes: [
      "Custom application architecture",
      "Frontend and backend development",
      "Authentication and user roles",
      "Database development",
      "Dashboards and workflows",
      "API and third-party integrations",
      "Testing and deployment",
      "Technical documentation",
      "Post-launch support plan",
    ],
    timeline: "4–8+ weeks",
    ctaLabel: "Discuss Your Application",
  },
];

export const outreachQuote = {
  heading: "Outreach work is quoted separately",
  description:
    "Need cold email outreach, lead generation, or LinkedIn prospecting? These services are quoted based on your target market, lead volume, infrastructure, and level of campaign management.",
  ctaLabel: "Request an Outreach Quote",
} as const;
