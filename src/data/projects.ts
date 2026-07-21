import type { Project } from "@/types";

export const projectsIntro = {
  label: "Selected Work",
  heading: "Products and Systems I’ve Built",
  description:
    "A selection of SaaS products, web applications, and growth systems that demonstrate how I approach product development and business problems.",
} as const;

export const projects: readonly Project[] = [
  {
    id: "dentflow",
    name: "DentFlow",
    category: "Self-Initiated SaaS Product",
    heading: "Dental Practice Management in One Focused Workspace",
    description:
      "DentFlow is a dental practice management SaaS designed to organize appointments, patient information, clinical records, billing, invoices, team access, and operational reporting within one application.",
    highlights: [
      "Practice dashboard",
      "Appointment management",
      "Patient and clinical records",
      "Billing and invoices",
      "Role-based access",
      "Operational reporting",
    ],
    tags: ["SaaS", "Dashboard", "Healthcare", "Role-Based Access"],
    links: [
      { label: "Live site", href: "https://dentflow-eight.vercel.app/", primary: true },
      { label: "GitHub", href: "https://github.com/masumgaibandha/dentflow" },
    ],
    image: {
      src: "/projects/dentflow.webp",
      width: 1200,
      height: 900,
      alt: "The DentFlow landing page, headlined “Run your clinic with clarity”, with navigation for Dashboard, Services and Manage Services.",
    },
  },
  {
    id: "skillpath-ai",
    name: "SkillPath AI",
    category: "AI-Powered Learning Platform",
    heading: "Personalized Learning and Course Discovery",
    description:
      "SkillPath AI helps learners discover relevant courses, explore structured learning paths, and make better learning decisions using AI-powered recommendations.",
    highlights: [
      "Course discovery",
      "Personalized learning paths",
      "AI recommendations",
      "Search and filtering",
      "Learner-focused interface",
      "Progress-oriented experience",
    ],
    tags: ["AI Integration", "Education", "Personalization", "Full-Stack"],
    links: [
      {
        label: "Live site",
        href: "https://skillpath-ai-frontend-umber.vercel.app",
        primary: true,
      },
      { label: "GitHub", href: "https://github.com/masumgaibandha/skillpath-ai" },
    ],
    image: {
      src: "/projects/skillpath-ai.webp",
      width: 1200,
      height: 900,
      alt: "The SkillPath AI course-discovery interface, headlined “Find the right course, fast”, above a “How it works” row.",
    },
  },
  {
    id: "taskforge",
    name: "TaskForge",
    category: "Freelance Marketplace",
    heading: "Get Tasks Done by Skilled Freelancers",
    description:
      "TaskForge is a freelance micro-task marketplace where clients post small tasks, receive proposals from freelancers, hire the best fit, and complete the work securely through Stripe-powered payments.",
    highlights: [
      "Task posting and browsing",
      "Proposal and hiring workflow",
      "Freelancer profiles and discovery",
      "Stripe payment integration",
      "Client and freelancer dashboards",
      "Search and category filtering",
    ],
    tags: ["Marketplace", "Stripe Payments", "MERN", "Full-Stack"],
    links: [
      {
        label: "Live site",
        href: "https://taskforge-client.vercel.app/",
        primary: true,
      },
      {
        label: "Client repo",
        href: "https://github.com/masumgaibandha/taskforge-client",
      },
      {
        label: "Server repo",
        href: "https://github.com/masumgaibandha/taskforge-server",
      },
    ],
    image: {
      /* Cropped to the app region — see the note in the conversion script. */
      src: "/projects/taskforge.webp",
      width: 876,
      height: 1024,
      alt: "The TaskForge marketplace app showing featured freelance tasks with budgets, and a Top Freelancers list.",
    },
  },
  {
    id: "b2b-outreach-system",
    name: "B2B Outreach System",
    category: "Cold Email and Lead Generation",
    heading: "A Repeatable Outreach System for B2B Client Acquisition",
    description:
      "An end-to-end outreach workflow covering email infrastructure, prospect sourcing, segmentation, campaign creation, deliverability monitoring, and reply management.",
    highlights: [
      "Ideal customer profile research",
      "Domain and mailbox infrastructure",
      "Targeted lead sourcing",
      "Email verification",
      "Campaign sequences",
      "Performance monitoring",
    ],
    tags: ["Cold Email", "Deliverability", "Lead Generation", "Automation"],
    /* Client engagements, so there is nothing public to link to. */
    links: [],
    /*
     * No `image`: this is a delivery process across client accounts, not a
     * product with a UI, and no genuine screenshot of it exists in resources/.
     * The card renders a typographic panel instead of a fabricated one.
     */
  },
];
