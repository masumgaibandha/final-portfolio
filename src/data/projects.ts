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
      width: 1154,
      height: 852,
      alt: "The DentFlow landing page in a browser window, headlined “Run your clinic with clarity. Care for patients with confidence.”, with navigation for Dashboard, Services and Manage Services.",
      /* Logo and headline start ~3% from the left; a centre crop clips them. */
      objectPosition: "object-left",
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
      width: 1168,
      height: 815,
      alt: "The SkillPath AI app, headlined “Find the right course, fast”, above a “How it works” row of search, enrol, study-plan and chat steps.",
      /* Headline occupies the left 48%; anchoring left keeps it whole. */
      objectPosition: "object-left",
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
      /*
       * Anchored right: the source still carries a sliver of marketing copy on
       * its left, and a centre crop left that text half-cut. Right keeps the
       * app UI — task cards and freelancer list — and drops the sliver.
       */
      objectPosition: "object-right",
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
    image: {
      src: "/projects/b2b-outreach-system.webp",
      width: 1100,
      height: 534,
      alt: "An Instantly.ai campaign dashboard reporting 5.6K emails sent, an 83.9% open rate, a 2.7% reply rate and 25 opportunities, above a daily sends-and-opens chart.",
      /*
       * At 2.06:1 this is far wider than the side panels, so Projects gives it
       * a full-width banner whose ratio matches the source — no crop at all,
       * which matters because the metrics sit at both far edges and a cover
       * crop in a square panel would discard more than half of them.
       */
      objectPosition: "object-center",
    },
  },
];
