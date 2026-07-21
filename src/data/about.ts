import type { SkillGroup } from "@/types";

export const about = {
  label: "About Me",
  heading: "Development Experience With a Practical Growth Mindset",
  paragraphs: [
    "I’m a full-stack web developer and outreach professional based in Bangladesh, working with clients worldwide.",
    "On the development side, I create responsive websites, SaaS applications, dashboards, marketplaces, APIs, and custom business platforms. My primary technologies include JavaScript, TypeScript, React, Next.js, Node.js, Express.js, and MongoDB.",
    "My experience in cold email outreach and lead generation gives me a broader understanding of how businesses attract prospects, convert opportunities, and grow. I have helped B2B companies with email infrastructure, deliverability, prospect research, campaign management, and LinkedIn outreach.",
    "Whether I’m developing a web application or building an outreach system, my focus is the same: understand the real problem, create a practical solution, and communicate clearly throughout the project.",
  ],
} as const;

export const skillGroups: readonly SkillGroup[] = [
  {
    title: "Frontend Development",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "HeroUI",
    ],
  },
  {
    title: "Backend Development",
    items: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST APIs",
      "Authentication (Better Auth & Firebase)",
      "Role-based authorization",
      "Third-party integrations",
    ],
  },
  {
    title: "B2B Growth",
    items: [
      "Cold email infrastructure",
      "Email deliverability",
      "Lead generation",
      "Prospect list building",
      "LinkedIn outreach",
      "Campaign management",
      "Mailbox configuration (Google Workspace, Microsoft 365)",
      "Reply management",
      "Outreach automation",
    ],
  },
  {
    title: "Tools",
    items: [
      "Instantly",
      "Smartlead",
      "ReachInbox",
      "Lemlist",
      "Apollo",
      "HubSpot",
      "Google Workspace",
      "Microsoft 365",
    ],
  },
];
