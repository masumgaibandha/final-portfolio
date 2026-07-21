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
 * /resources as well as the homepage. On the homepage Next still treats them as
 * in-page scrolls.
 */
export const navLinks: readonly NavLink[] = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

export const socialLinks: readonly SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/almasumbd" },
  { label: "X", href: "https://x.com/almasumbd" },
  { label: "GitHub", href: "https://github.com/masumgaibandha" },
  { label: "Upwork", href: site.upworkUrl },
];
