import type { SelectOption } from "@/types";

export const contactIntro = {
  label: "Contact",
  heading: "Tell Me About Your Project",
  description:
    "Need a full-stack developer, a cold email specialist, or help building a targeted prospecting system? Send me a few details about your project and I’ll respond directly.",
  /* Carried over from the removed CTA band so the approved copy isn't lost. */
  guidance:
    "Tell me what you’re working on, where you’re currently stuck, and what result you want to achieve. I’ll review the details and recommend the clearest next step.",
} as const;

export const serviceOptions: readonly SelectOption[] = [
  { value: "full-stack", label: "Full-Stack Web Development" },
  { value: "nextjs-react", label: "Next.js or React Development" },
  { value: "mern", label: "MERN Stack Development" },
  { value: "saas-mvp", label: "SaaS or MVP Development" },
  { value: "cold-email", label: "Cold Email Outreach" },
  { value: "lead-generation", label: "Lead Generation" },
  { value: "linkedin", label: "LinkedIn Outreach" },
  { value: "other", label: "Other" },
];

export const budgetOptions: readonly SelectOption[] = [
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-3k", label: "$1,000–$3,000" },
  { value: "3k-5k", label: "$3,000–$5,000" },
  { value: "5k-10k", label: "$5,000–$10,000" },
  { value: "10k-plus", label: "$10,000+" },
  { value: "unsure", label: "Not sure yet" },
];

export const footer = {
  positioning:
    "Full-Stack Developer and B2B Outreach Specialist building useful digital products and practical growth systems for businesses worldwide.",
  copyright: "© 2026 MasumDev. All rights reserved.",
  affiliateDisclosure:
    "Some links on this website may be affiliate links. If you purchase through one of these links, I may receive a commission at no additional cost to you. I only recommend tools I use or genuinely trust.",
} as const;
