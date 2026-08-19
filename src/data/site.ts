import type { NavLink, SocialLink } from "@/types";

export const site = {
  name: "MasumDev",
  fullName: "Abdullah Al Masum",
  role: "Full-Stack Developer & B2B Outreach Specialist",
  url: "https://masumdev.com",
  email: "masum@masumdev.com",
  resumeUrl: "/resources/Abdullah-Al-Masum-Resume.pdf",
  upworkUrl:
    "https://www.upwork.com/freelancers/~01a5eccfaf40a8a065?viewMode=1",
  /** Source for this site. */
  repoUrl: "https://github.com/masumgaibandha/final-portfolio",
  description:
    "Full-stack developer building fast Next.js and MERN web apps. I also help B2B teams with cold email outreach, lead generation, and LinkedIn prospecting.",
} as const;

/*
 * Root-relative (`/#about`, not `#about`) so these resolve correctly from
 * /resources and /blog as well as the homepage. On the homepage Next still
 * treats them as in-page scrolls.
 */

/*
 * Primary navigation, deliberately short. Home lives on the logo, Contact on
 * the "Let's Talk" button, and Testimonials and Pricing are found by scrolling
 * — all four still exist as sections, they are just not competing for space in
 * the header.
 */
export const navLinks: readonly NavLink[] = [
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Masterclass", href: "/masterclass/lead-generation-cold-email" },
];

/*
 * Footer navigation. Deliberately the six destinations worth a direct link —
 * Testimonials and Pricing are found by scrolling, and the résumé sits in the
 * About section, so none of them need a second entry point down here.
 */
export const footerLinks: readonly NavLink[] = [
  { label: "Projects", href: "/#projects" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/#contact" },
];

export const socialLinks: readonly SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/almasumbd" },
  { label: "X", href: "https://x.com/almasumbd" },
  { label: "GitHub", href: "https://github.com/masumgaibandha" },
  { label: "Upwork", href: site.upworkUrl },
];
