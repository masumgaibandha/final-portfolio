import type { TrustIndicator } from "@/types";

export const hero = {
  eyebrow: "Full-Stack Developer & B2B Outreach Specialist",
  headline: "I Build Web Products That Work",
  headlineAccent: "and Outreach Systems That Generate Opportunities.",
  description:
    "I’m Abdullah Al Masum, a full-stack developer and B2B outreach specialist. I build fast, scalable applications using React, Next.js, TypeScript, and the MERN stack. I also help businesses reach the right prospects through cold email, lead generation, and LinkedIn outreach.",
  availability: "Available for selected freelance and long-term projects.",
} as const;

export const trustIndicators: readonly TrustIndicator[] = [
  { value: "Top Rated", label: "Upwork Freelancer" },
  { value: "$160K+", label: "Earned on Upwork" },
  { value: "300+", label: "Upwork projects completed" },
  { value: "23,000+", label: "Hours worked" },
];
