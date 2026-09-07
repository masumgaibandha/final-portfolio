import type { SelectOption } from "@/types";

export const contactIntro = {
  label: "Contact",
  heading: "Tell Me About Your Project",
  description:
    "Need a full-stack developer for a new application, or help improving an existing one? Send me a few details about your project and I’ll respond directly.",
  /* Carried over from the removed CTA band so the approved copy isn't lost. */
  guidance:
    "Tell me what you’re working on, where you’re currently stuck, and what result you want to achieve. I’ll review the details and recommend the clearest next step.",
} as const;

export const serviceOptions: readonly SelectOption[] = [
  { value: "full-stack", label: "Full-Stack Web Application" },
  { value: "frontend", label: "Frontend Development" },
  { value: "backend-api", label: "Backend/API Development" },
  { value: "dashboard-admin", label: "Dashboard or Admin Panel" },
  { value: "existing-app", label: "Existing Application Improvement" },
  { value: "other", label: "Other Development Project" },
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
    "Full-Stack Web Developer building fast, secure, scalable web applications for businesses worldwide.",
  copyright: "© 2026 MasumDev. All rights reserved.",
} as const;
