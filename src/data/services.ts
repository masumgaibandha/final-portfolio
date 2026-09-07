import type { Service } from "@/types";

export const servicesIntro = {
  label: "Services",
  heading: "How I Can Help Your Business",
} as const;

export const services: readonly Service[] = [
  {
    id: "full-stack-web-applications",
    title: "Full-Stack Web Applications",
    summary:
      "I build complete web applications end to end — from the database schema to the deployed frontend — using Next.js, React, Node.js, Express.js, and MongoDB.",
    includes: [
      "Next.js App Router applications",
      "SaaS and MVP development",
      "Admin and role-based dashboards",
      "Authentication and protected routes",
      "Payment integrations",
      "Database schema and query design",
      "Deployment and production readiness",
    ],
    ctaLabel: "Discuss Your Project",
  },
  {
    id: "frontend-development",
    title: "Frontend Development",
    summary:
      "I build responsive, accessible React interfaces that hold up across devices — from marketing pages to complex, data-driven dashboards.",
    includes: [
      "Responsive React and Next.js interfaces",
      "Component architecture and reusable UI",
      "Tailwind CSS and HeroUI implementation",
      "Client-side form validation",
      "Accessibility and responsive QA",
      "Performance optimization",
    ],
    ctaLabel: "Discuss Your Project",
  },
  {
    id: "backend-apis-database",
    title: "Backend APIs and Database Systems",
    summary:
      "I design and build the backend systems that power an application — REST APIs, database models, and the business logic connecting them.",
    includes: [
      "REST API design and integration",
      "MongoDB schema and query implementation",
      "Authentication and role-based access control",
      "Third-party API integrations",
      "Rate limiting and request validation",
      "Admin workflows",
    ],
    ctaLabel: "Discuss Your Project",
  },
  {
    id: "product-engineering-optimization",
    title: "Product Engineering and Optimization",
    summary:
      "For an existing application, I improve what's already shipped — performance, accessibility, code quality, and features that need to be added or fixed.",
    includes: [
      "Performance optimization",
      "Accessibility and responsive QA",
      "Codebase review and refactoring",
      "New feature implementation",
      "Bug fixes and stability improvements",
      "Deployment and CI improvements",
    ],
    ctaLabel: "Discuss Your Project",
  },
];
