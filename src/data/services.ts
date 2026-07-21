import type { Service } from "@/types";

export const servicesIntro = {
  label: "Services",
  heading: "How I Can Help Your Business",
} as const;

export const services: readonly Service[] = [
  {
    id: "full-stack-development",
    title: "Full-Stack Web Development",
    summary:
      "I build responsive, scalable websites and web applications using modern frontend and backend technologies. From business websites to complex SaaS platforms, I can manage the complete development process.",
    includes: [
      "Next.js and React development",
      "MERN stack applications",
      "SaaS and MVP development",
      "Admin dashboards",
      "API development and integrations",
      "Authentication and authorization",
      "Database design",
      "Performance optimization",
    ],
    ctaLabel: "Discuss a Development Project",
  },
  {
    id: "cold-email-outreach",
    title: "Cold Email Outreach",
    summary:
      "I build and manage cold email systems designed around relevance, deliverability, and consistent execution—not mass sending.",
    includes: [
      "Domain and mailbox setup",
      "DNS configuration",
      "Deliverability audits",
      "Campaign strategy",
      "Email sequence writing",
      "Campaign launch and management",
      "Performance monitoring",
      "Reply handling",
    ],
    ctaLabel: "Improve My Outreach",
  },
  {
    id: "lead-generation",
    title: "B2B Lead Generation",
    summary:
      "I research and build targeted prospect lists based on your ideal customer profile, market, company size, location, technology, and buying signals.",
    includes: [
      "Ideal customer profile development",
      "Apollo prospecting",
      "LinkedIn Sales Navigator research",
      "Contact data enrichment",
      "Email verification",
      "Lead segmentation",
      "CRM-ready prospect lists",
    ],
    ctaLabel: "Build My Prospect List",
  },
  {
    id: "linkedin-outreach",
    title: "LinkedIn Outreach",
    summary:
      "I help businesses identify and connect with relevant decision-makers through personalized LinkedIn prospecting and structured follow-up.",
    includes: [
      "Prospect research",
      "Connection strategy",
      "Personalized messaging",
      "Follow-up sequences",
      "Response tracking",
      "Lead qualification",
    ],
    ctaLabel: "Plan a LinkedIn Campaign",
  },
];
