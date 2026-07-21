import type { AffiliateTool } from "@/types";

/*
 * Affiliate content, approved in portfolio-content.md § "Recommended Outreach
 * Tools". The `href` values are copied character for character from that file —
 * a mistyped `via` parameter silently drops attribution, so do not "tidy" them.
 *
 * These are recommendations, not a service. Affiliate work must never appear in
 * the hero, the About section, or the Services list.
 */
export const outreachStackIntro = {
  label: "My Outreach Stack",
  heading: "Tools Behind My Outreach Work",
  description:
    "These are tools I use across real cold email workflows—from mailbox infrastructure and campaign management to deliverability monitoring and reply handling. Each platform serves a different purpose, so the right choice depends on your team, sending volume, and workflow.",
} as const;

/** Required directly under the tool cards — footer-only disclosure is not enough. */
export const affiliateDisclosure =
  "Some links in this section are affiliate links. If you sign up through one of these links, I may earn a commission at no additional cost to you. I recommend these tools because I personally use them in real outreach work.";

export const affiliateTools: readonly AffiliateTool[] = [
  {
    id: "zapmail",
    name: "Zapmail",
    category: "Email Infrastructure",
    heading: "Build and Manage Your Sending Infrastructure",
    description:
      "I use Zapmail to simplify the setup and management of outreach mailboxes. It is a practical option for teams that need scalable Google or Microsoft email infrastructure without configuring every account manually.",
    usedFor: [
      "Google and Microsoft mailboxes",
      "Outreach infrastructure",
      "Mailbox management",
      "Domain and DNS workflows",
      "Scaling sending accounts",
    ],
    ctaLabel: "Explore Zapmail",
    href: "https://zapmail.ai/?via=abdullah",
    bestFor: "Email infrastructure",
    useCase: "Creating and managing outreach mailboxes",
  },
  {
    id: "reachinbox",
    name: "ReachInbox",
    category: "All-in-One Outreach Platform",
    heading: "Manage Outreach From One Platform",
    description:
      "ReachInbox is a practical all-in-one option for creating campaigns, connecting email accounts, managing warm-up, monitoring performance, personalizing outreach, and organizing replies.",
    usedFor: [
      "Campaign management",
      "Email account warm-up",
      "Lead sourcing and personalization",
      "Campaign analytics",
      "Unified reply management",
      "Deliverability monitoring",
    ],
    ctaLabel: "Explore ReachInbox",
    href: "https://www.reachinbox.ai/?via=abdullah",
    bestFor: "All-in-one workflows",
    useCase: "Campaigns, warm-up, leads, analytics, and replies",
  },
  {
    id: "instantly",
    name: "Instantly",
    category: "Cold Email Campaign Platform",
    heading: "Build and Scale Cold Email Campaigns",
    description:
      "I use Instantly to manage multiple sending accounts, organize leads, create outreach sequences, monitor campaign performance, and handle replies from a centralized workspace.",
    usedFor: [
      "Multi-account campaign management",
      "Email warm-up",
      "Lead and campaign organization",
      "Automated follow-ups",
      "Campaign analytics",
      "Centralized reply management",
    ],
    ctaLabel: "Explore Instantly",
    href: "https://instantly.ai/?via=aam",
    bestFor: "Scalable campaign management",
    useCase: "Multi-account sending, sequences, analytics, and reply handling",
  },
];

export const outreachStackCta = {
  heading: "Not Sure Which Tool Fits Your Outreach Setup?",
  description:
    "The right platform depends on your target market, campaign volume, mailbox infrastructure, and internal workflow. I can help you choose and configure a setup that fits your actual requirements.",
  primaryLabel: "Discuss Your Outreach Setup",
  secondaryLabel: "View All Recommended Tools",
  secondaryHref: "/resources",
} as const;

export const resourcesPage = {
  seoTitle: "Cold Email Tools I Use and Recommend | MasumDev",
  metaDescription:
    "Explore the cold email infrastructure, campaign management, deliverability, and lead generation tools I use in real B2B outreach workflows.",
  label: "Recommended Resources",
  heading: "Cold Email Tools I Use and Recommend",
  intro: [
    "Choosing a cold email platform should depend on your workflow—not the popularity of the tool. These are platforms I have used for email infrastructure, campaign management, deliverability, lead generation, and reply handling.",
    "I have included what I use each platform for and the type of business it may suit. If you need help choosing or implementing your outreach stack, you can contact me for a personalized recommendation.",
  ],
  comparisonHeading: "Quick Comparison",
  cta: {
    heading: "Need More Than the Software?",
    description:
      "Tools are only one part of a successful outreach system. I can help with infrastructure, deliverability, lead sourcing, campaign strategy, email copy, launch, and ongoing management.",
    primaryLabel: "Work With Me",
    secondaryLabel: "Contact Me",
  },
} as const;
