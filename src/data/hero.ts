import type { TrustIndicator } from "@/types";

export const hero = {
  eyebrow: "Full-Stack Web Developer",
  headline: "I Build Full-Stack Web Products",
  headlineAccent: "That Solve Real Business Problems.",
  description:
    "I’m Abdullah Al Masum, a full-stack web developer. I design and develop fast, secure, scalable web applications with Next.js, React, Node.js, MongoDB, and modern TypeScript — from responsive interfaces to production-ready APIs and dashboards.",
  availability: "Available for selected freelance and long-term projects.",
} as const;

export const trustIndicators: readonly TrustIndicator[] = [
  { value: "3", label: "Featured Full-Stack Projects" },
  { value: "15+", label: "Technologies Used" },
  { value: "Full-Stack", label: "Next.js, React & Node.js" },
];
