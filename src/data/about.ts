/*
 * Split into named parts rather than one `paragraphs` array: the layout gives
 * the lead, the two body columns and the closing line distinct treatments, and
 * addressing them by array index made the component silently position-dependent.
 */
export const about = {
  label: "About Me",
  heading: "Development Experience With a Practical Growth Mindset",
  lead: "I’m a full-stack web developer and outreach professional based in Bangladesh, working with clients worldwide.",
  body: [
    "On the development side, I create responsive websites, SaaS applications, dashboards, marketplaces, APIs, and custom business platforms. My primary technologies include JavaScript, TypeScript, React, Next.js, Node.js, Express.js, and MongoDB.",
    "My experience in cold email outreach and lead generation gives me a broader understanding of how businesses attract prospects, convert opportunities, and grow. I have helped B2B companies with email infrastructure, deliverability, prospect research, campaign management, and LinkedIn outreach.",
  ],
  closing:
    "Whether I’m developing a web application or building an outreach system, my focus is the same: understand the real problem, create a practical solution, and communicate clearly throughout the project.",
} as const;

/*
 * `skillGroups` used to live here and render as chip cards in About's right
 * column. It moved to `src/data/skills.ts` and the Technical Skills section —
 * listing the same technologies in both places made the page repeat itself.
 * The outreach tooling that array also carried is covered by the Outreach
 * Stack section, so it was not carried over.
 */
