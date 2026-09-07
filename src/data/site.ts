import type { NavLink, SocialLink } from "@/types";

export const site = {
  name: "MasumDev",
  fullName: "Abdullah Al Masum",
  role: "Full-Stack Web Developer",
  url: "https://masumdev.com",
  email: "masum@masumdev.com",
  resumeUrl: "/resources/Abdullah-Al-Masum-Resume.pdf",
  upworkUrl:
    "https://www.upwork.com/freelancers/~01a5eccfaf40a8a065?viewMode=1",
  /** Source for this site. */
  repoUrl: "https://github.com/masumgaibandha/final-portfolio",
  description:
    "Full-stack web developer building fast, scalable web applications with Next.js, React, Node.js, and MongoDB.",
} as const;

/*
 * Root-relative (`/#about`, not `#about`) so these resolve correctly from
 * /blog as well as the homepage. On the homepage Next still treats them as
 * in-page scrolls.
 */

/*
 * Primary navigation, deliberately short. Home lives on the logo, Contact on
 * the "Let's Talk" button, and Pricing is found by scrolling — all still
 * exist as sections, they are just not competing for space in the header.
 */
export const navLinks: readonly NavLink[] = [
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
];

/*
 * Footer navigation. Deliberately the five destinations worth a direct link —
 * Pricing is found by scrolling, and the résumé sits in the About section, so
 * neither needs a second entry point down here.
 */
export const footerLinks: readonly NavLink[] = [
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export const socialLinks: readonly SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/almasumbd" },
  { label: "X", href: "https://x.com/almasumbd" },
  { label: "GitHub", href: "https://github.com/masumgaibandha" },
  { label: "Upwork", href: site.upworkUrl },
];
