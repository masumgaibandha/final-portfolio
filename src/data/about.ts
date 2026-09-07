/*
 * Split into named parts rather than one `paragraphs` array: the layout gives
 * the lead, the two body columns and the closing line distinct treatments, and
 * addressing them by array index made the component silently position-dependent.
 */
export const about = {
  label: "About Me",
  heading: "Full-Stack Development Experience With a Practical Mindset",
  lead: "I’m a full-stack web developer based in Bangladesh, working with clients worldwide.",
  body: [
    "I build responsive websites, SaaS applications, dashboards, marketplaces, APIs, and custom business platforms. My primary technologies are JavaScript, TypeScript, React, Next.js, Node.js, Express.js, and MongoDB.",
    "My work covers the full stack — from designing accessible, responsive interfaces to building authentication, role-based dashboards, database schemas, and third-party integrations like payments. I care about shipping applications that hold up under real usage, not just demos.",
  ],
  closing:
    "Whatever the project, my focus is the same: understand the real problem, create a practical solution, and communicate clearly throughout.",
} as const;

/*
 * `skillGroups` used to live here and render as chip cards in About's right
 * column. It moved to `src/data/skills.ts` and the Technical Skills section —
 * listing the same technologies in both places made the page repeat itself.
 */
