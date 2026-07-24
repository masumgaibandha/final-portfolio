import { LuWaypoints } from "react-icons/lu";
import {
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

import type { SkillCategory } from "@/types";

export const skillsIntro = {
  label: "Technical Skills",
  heading: "The Stack I Build With",
  /*
   * MERN is named here rather than listed as an item — MongoDB, Express, React
   * and Node all appear below, and a fifth chip for the acronym would count the
   * same four technologies twice.
   */
  description:
    "The MERN stack is my foundation — MongoDB, Express, React and Node — extended with TypeScript, Next.js and Tailwind CSS for production work.",
} as const;

/*
 * Brand colours.
 *
 * These hex values are the one sanctioned exception to the "no hardcoded hex"
 * rule: they are other companies' marks, not this site's palette, so there is
 * no token that could stand in for them. They live here rather than in the
 * component so the exception stays in one auditable place, and each is written
 * as a literal `text-[#...]` class because Tailwind's scanner cannot see a
 * class string assembled at runtime.
 *
 * Every value is at least 3:1 against the white card. Four brands publish a
 * mark too light to clear that on white — JavaScript's #F7DF1E is 1.35:1,
 * React's #61DAFB is 1.62:1, Tailwind's #06B6D4 is 2.43:1 and Netlify's
 * #00C7B7 is 2.13:1 — so those four are darkened to the nearest tone that
 * passes while staying recognisably the brand's hue. The rest are official.
 *
 * Next.js, Express, GitHub and Vercel are black-on-white brands, so they take
 * the site's own ink rather than a bespoke near-black.
 */
export const skillCategories: readonly SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    skills: [
      { name: "HTML5", icon: SiHtml5, iconClass: "text-[#E34F26]" },
      /*
       * `SiCss`, not `SiCss3` — Simple Icons dropped the version suffix, and
       * the old name no longer exists in react-icons 5.x. #663399 is the
       * official colour of that newer mark, which is what this glyph draws.
       */
      { name: "CSS3", icon: SiCss, iconClass: "text-[#663399]" },
      /* Official #F7DF1E is 1.35:1 on white — darkened to hold the gold. */
      { name: "JavaScript", icon: SiJavascript, iconClass: "text-[#A8860B]" },
      { name: "TypeScript", icon: SiTypescript, iconClass: "text-[#3178C6]" },
      /* React's own darker brand blue, as used on react.dev. */
      { name: "React.js", icon: SiReact, iconClass: "text-[#149ECA]" },
      { name: "Next.js", icon: SiNextdotjs, iconClass: "text-ink" },
      /* Tailwind cyan-600 rather than cyan-500, which is 2.43:1 on white. */
      { name: "Tailwind CSS", icon: SiTailwindcss, iconClass: "text-[#0891B2]" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Database",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, iconClass: "text-[#339933]" },
      { name: "Express.js", icon: SiExpress, iconClass: "text-ink" },
      { name: "MongoDB", icon: SiMongodb, iconClass: "text-[#47A248]" },
      /*
       * REST has no brand, so a generic Lucide glyph carries it — in the site's
       * own terracotta, which marks it as ours rather than a vendor's.
       */
      { name: "REST APIs", icon: LuWaypoints, iconClass: "text-action" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Deployment",
    skills: [
      { name: "Git", icon: SiGit, iconClass: "text-[#F05032]" },
      { name: "GitHub", icon: SiGithub, iconClass: "text-ink" },
      { name: "Vercel", icon: SiVercel, iconClass: "text-ink" },
      /* Official #00C7B7 is 2.13:1 on white — darkened to hold the teal. */
      { name: "Netlify", icon: SiNetlify, iconClass: "text-[#009688]" },
    ],
  },
];
