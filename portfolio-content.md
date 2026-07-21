# Portfolio Content and Project Guidelines

## Project Overview

Build a premium, modern portfolio website for Abdullah Al Masum. Position him primarily as a full-stack web developer, with cold email outreach and lead generation as complementary growth services.

## Technology

- Next.js App Router with TypeScript
- Tailwind CSS
- HeroUI
- React Icons (`react-icons`)

Use Server Components by default and Client Components only when interactivity requires them. Use reusable, accessible components and preserve the existing project structure where practical.

### Public resources

- Résumé source file: `public/resources/Abdullah-Al-Masum-Resume.pdf`
- Public résumé URL: `/resources/Abdullah-Al-Masum-Resume.pdf`

Do not reference files from a private source directory in browser links. Any downloadable asset must be placed inside the Next.js `public` directory.

## Typography

- Headings: Playfair Display, weight 700
- Decorative editorial text: Playfair Display, weight 400 italic
- Body: Poppins, weight 400
- Navigation, labels, and buttons: Poppins, weights 500–600

Load fonts with `next/font/google`.

## Colors

- Background: `#FFFFFF`
- Warm surface: `#F8F2E7`
- Light cream: `#FFF9D9`
- Warm yellow: `#FFEEB8`
- Soft peach: `#FFE3C4`
- Primary text: `#020000`
- Muted text: `#625E5B`
- Accent orange: `#FC7E07`
- Border: `#E8E2D8`

Use the orange sparingly for indicators, active states, and small highlights. A subtle cream, yellow, and peach radial gradient may be used in the hero. Avoid neon colors, excessive gradients, glassmorphism, and heavy animation.

## Design and Development Rules

- Create a premium editorial look with generous whitespace, large headings, strong typography, and restrained visual effects.
- Build mobile-first and ensure the site works across phones, tablets, laptops, and large screens.
- Use HeroUI selectively and customize components to match the design system.
- Use `next/image` for optimized images and `react-icons` for icons.
- Use semantic HTML, one H1 per page, accessible forms, visible focus states, and descriptive alt text.
- Use the Next.js Metadata API, canonical URLs, Open Graph data, structured data, `sitemap.xml`, and `robots.txt`.
- Do not fabricate testimonials, clients, project results, or performance metrics.
- Keep portfolio content in structured data files rather than duplicating it across components.
- Before implementing a major section, inspect the existing code and present a concise plan.

## Approved Website Content

Use the following copy as the content source. Minor edits are allowed for grammar, clarity, responsive layout, and avoiding repetition, but do not change factual claims without approval.

Your strongest positioning is:

> Full-stack developer first, with cold email outreach and lead generation as complementary growth services.

Avoid placing affiliate marketing prominently in the hero. It can distract potential clients. Add a separate “Recommended Tools” or “Resources” page for affiliate content.

I also recommend adding a Services section, even though it wasn’t in your original list. Without it, visitors may not understand exactly what they can hire you for.

# 1. Navbar

**Logo/Name:**
MasumDev

**Navigation:**

* Home
* About
* Services
* Projects
* Testimonials
* Pricing
* Contact

**Navbar button:**
Let’s Talk

# 2. Hero Area

**Small heading:**
Full-Stack Developer & B2B Outreach Specialist

**Main heading (H1):**
I Build Web Products That Work—and Outreach Systems That Generate Opportunities.

**Description:**
I’m Abdullah Al Masum, a full-stack developer and B2B outreach specialist. I build fast, scalable applications using React, Next.js, TypeScript, and the MERN stack. I also help businesses reach the right prospects through cold email, lead generation, and LinkedIn outreach.

**Primary button:**
View My Projects

**Secondary button:**
Start a Project

**Résumé button:**
Download My Résumé

**Résumé URL:**
`/resources/Abdullah-Al-Masum-Resume.pdf`

**Availability text:**
Available for selected freelance and long-term projects.

**Trust indicators:**

* Top Rated Upwork Freelancer
* $160K+ Earned
* 300+ Upwork Projects Completed
* 23,000+ Hours Worked

# 3. About Area

**Section label:**
About Me

**Heading:**
Development Experience With a Practical Growth Mindset

**Content:**
I’m a full-stack web developer and outreach professional based in Bangladesh, working with clients worldwide.

On the development side, I create responsive websites, SaaS applications, dashboards, marketplaces, APIs, and custom business platforms. My primary technologies include JavaScript, TypeScript, React, Next.js, Node.js, Express.js, and MongoDB.

My experience in cold email outreach and lead generation gives me a broader understanding of how businesses attract prospects, convert opportunities, and grow. I have helped B2B companies with email infrastructure, deliverability, prospect research, campaign management, and LinkedIn outreach.

Whether I’m developing a web application or building an outreach system, my focus is the same: understand the real problem, create a practical solution, and communicate clearly throughout the project.

### Technical skills

**Frontend Development**

* HTML5
* CSS3
* JavaScript
* TypeScript
* React
* Next.js
* Tailwind CSS
* HeroUI

**Backend Development**

* Node.js
* Express.js
* MongoDB
* REST APIs
* Authentication (Better Auth & Firebase)
* Role-based authorization
* Third-party integrations

**B2B Growth**

* Cold email infrastructure
* Email deliverability
* Lead generation
* Prospect list building
* LinkedIn Outreach
* Campaign management
* Mailbox configuration for Google Workspace, Microsoft 365, and other providers
* Reply management
* Outreach automation

**Tools**

* Instantly
* Smartlead
* ReachInbox
* Lemlist
* Apollo
* HubSpot
* Google Workspace
* Microsoft 365

# 4. Services Area

**Section label:**
Services

**Heading:**
How I Can Help Your Business

### Full-Stack Web Development

I build responsive, scalable websites and web applications using modern frontend and backend technologies. From business websites to complex SaaS platforms, I can manage the complete development process.

**Services include:**

* Next.js and React development
* MERN stack applications
* SaaS and MVP development
* Admin dashboards
* API development and integrations
* Authentication and authorization
* Database design
* Performance optimization

**Button:**
Discuss a Development Project

### Cold Email Outreach

I build and manage cold email systems designed around relevance, deliverability, and consistent execution—not mass sending.

**Services include:**

* Domain and mailbox setup
* DNS configuration
* Deliverability audits
* Campaign strategy
* Email sequence writing
* Campaign launch and management
* Performance monitoring
* Reply handling

**Button:**
Improve My Outreach

### B2B Lead Generation

I research and build targeted prospect lists based on your ideal customer profile, market, company size, location, technology, and buying signals.

**Services include:**

* Ideal customer profile development
* Apollo prospecting
* LinkedIn Sales Navigator research
* Contact data enrichment
* Email verification
* Lead segmentation
* CRM-ready prospect lists

**Button:**
Build My Prospect List

### LinkedIn Outreach

I help businesses identify and connect with relevant decision-makers through personalized LinkedIn prospecting and structured follow-up.

**Services include:**

* Prospect research
* Connection strategy
* Personalized messaging
* Follow-up sequences
* Response tracking
* Lead qualification

**Button:**
Plan a LinkedIn Campaign

# 5. Project Area

**Section label:**
Selected Work

**Heading:**
Products and Systems I’ve Built

**Introduction:**
A selection of SaaS products, web applications, and growth systems that demonstrate how I approach product development and business problems.

### DentFlow

**Category:**
Self-Initiated SaaS Product

**Heading:**
Dental Practice Management in One Focused Workspace

**Description:**
DentFlow is a dental practice management SaaS designed to organize appointments, patient information, clinical records, billing, invoices, team access, and operational reporting within one application.

**Highlights:**

* Practice dashboard
* Appointment management
* Patient and clinical records
* Billing and invoices
* Role-based access
* Operational reporting

**Tags:**
SaaS · Dashboard · Healthcare · Role-Based Access

**Button:**
View DentFlow Case Study

### SkillPath AI

**Category:**
AI-Powered Learning Platform

**Heading:**
Personalized Learning and Course Discovery

**Description:**
SkillPath AI helps learners discover relevant courses, explore structured learning paths, and make better learning decisions using AI-powered recommendations.

**Highlights:**

* Course discovery
* Personalized learning paths
* AI recommendations
* Search and filtering
* Learner-focused interface
* Progress-oriented experience

**Tags:**
AI Integration · Education · Personalization · Full-Stack

**Button:**
View SkillPath AI

### TaskForge

**Category:**
Freelance Marketplace

**Heading:**
Get Tasks Done by Skilled Freelancers

**Description:**
TaskForge is a freelance micro-task marketplace where clients post small tasks, receive proposals from freelancers, hire the best fit, and complete the work securely through Stripe-powered payments.

**Highlights:**

* Task posting and browsing
* Proposal and hiring workflow
* Freelancer profiles and discovery
* Stripe payment integration
* Client and freelancer dashboards
* Search and category filtering

**Tags:**
Marketplace · Stripe Payments · MERN · Full-Stack

**Links:**

* Live: `https://taskforge-client.vercel.app/`
* Client repo: `https://github.com/masumgaibandha/taskforge-client`
* Server repo: `https://github.com/masumgaibandha/taskforge-server`

### B2B Outreach System

**Category:**
Cold Email and Lead Generation

**Heading:**
A Repeatable Outreach System for B2B Client Acquisition

**Description:**
An end-to-end outreach workflow covering email infrastructure, prospect sourcing, segmentation, campaign creation, deliverability monitoring, and reply management.

**Highlights:**

* Ideal customer profile research
* Domain and mailbox infrastructure
* Targeted lead sourcing
* Email verification
* Campaign sequences
* Performance monitoring

**Tags:**
Cold Email · Deliverability · Lead Generation · Automation

**Button:**
View My Outreach Process


# Recommended Outreach Tools

## Positioning and Placement

Do not present affiliate marketing as a service or mention it in the hero, About section, or primary positioning.

Add a compact “My Outreach Stack” section after Services and before Projects. Also create a dedicated `/resources` page containing more detailed tool recommendations.

The recommendations must feel educational and based on real experience. Do not describe every tool as the “best.” Explain which use case each tool is suitable for.

# Homepage Tools Section

**Section label:**  
My Outreach Stack

**Heading:**  
Tools Behind My Outreach Work

**Description:**  
These are tools I use across real cold email workflows—from mailbox infrastructure and campaign management to deliverability monitoring and reply handling. Each platform serves a different purpose, so the right choice depends on your team, sending volume, and workflow.

## Zapmail

**Category:**  
Email Infrastructure

**Heading:**  
Build and Manage Your Sending Infrastructure

**Description:**  
I use Zapmail to simplify the setup and management of outreach mailboxes. It is a practical option for teams that need scalable Google or Microsoft email infrastructure without configuring every account manually.

**Used for:**

- Google and Microsoft mailboxes
- Outreach infrastructure
- Mailbox management
- Domain and DNS workflows
- Scaling sending accounts

**Button:**  
Explore Zapmail

**Affiliate URL:**  
`https://zapmail.ai/?via=abdullah`

## ReachInbox

**Category:**  
All-in-One Outreach Platform

**Heading:**  
Manage Outreach From One Platform

**Description:**  
ReachInbox is a practical all-in-one option for creating campaigns, connecting email accounts, managing warm-up, monitoring performance, personalizing outreach, and organizing replies.

**Used for:**

- Campaign management
- Email account warm-up
- Lead sourcing and personalization
- Campaign analytics
- Unified reply management
- Deliverability monitoring

**Button:**  
Explore ReachInbox

**Affiliate URL:**  
`https://www.reachinbox.ai/?via=abdullah`

## Instantly

**Category:**  
Cold Email Campaign Platform

**Heading:**  
Build and Scale Cold Email Campaigns

**Description:**  
I use Instantly to manage multiple sending accounts, organize leads, create outreach sequences, monitor campaign performance, and handle replies from a centralized workspace.

**Used for:**

- Multi-account campaign management
- Email warm-up
- Lead and campaign organization
- Automated follow-ups
- Campaign analytics
- Centralized reply management

**Button:**  
Explore Instantly

**Affiliate URL:**  
`https://instantly.ai/?via=aam`

## Homepage Section CTA

**Heading:**  
Not Sure Which Tool Fits Your Outreach Setup?

**Description:**  
The right platform depends on your target market, campaign volume, mailbox infrastructure, and internal workflow. I can help you choose and configure a setup that fits your actual requirements.

**Primary button:**  
Discuss Your Outreach Setup

**Secondary button:**  
View All Recommended Tools

**Secondary button URL:**  
`/resources`

## Affiliate Disclosure

Display this disclosure directly below the tool cards. Do not place it only in the footer.

> **Disclosure:** Some links in this section are affiliate links. If you sign up through one of these links, I may earn a commission at no additional cost to you. I recommend these tools because I personally use them in real outreach work.

# Resources Page

**URL:**  
`/resources`

**SEO title:**  
Cold Email Tools I Use and Recommend | MasumDev

**Meta description:**  
Explore the cold email infrastructure, campaign management, deliverability, and lead generation tools I use in real B2B outreach workflows.

**Page label:**  
Recommended Resources

**Main heading (H1):**  
Cold Email Tools I Use and Recommend

**Introduction:**  
Choosing a cold email platform should depend on your workflow—not the popularity of the tool. These are platforms I have used for email infrastructure, campaign management, deliverability, lead generation, and reply handling.

I have included what I use each platform for and the type of business it may suit. If you need help choosing or implementing your outreach stack, you can contact me for a personalized recommendation.

## Quick Comparison

| Platform | Best suited for | What I use it for |
| --- | --- | --- |
| Zapmail | Email infrastructure | Creating and managing outreach mailboxes |
| ReachInbox | All-in-one workflows | Campaigns, warm-up, leads, analytics, and replies |
| Instantly | Scalable campaign management | Multi-account sending, sequences, analytics, and reply handling |

## Resources Page CTA

**Heading:**  
Need More Than the Software?

**Description:**  
Tools are only one part of a successful outreach system. I can help with infrastructure, deliverability, lead sourcing, campaign strategy, email copy, launch, and ongoing management.

**Primary button:**  
Work With Me

**Secondary button:**  
Contact Me

## Link Requirements

Use the affiliate URLs exactly as provided.

All affiliate links must:

- Open in a new tab.
- Include `rel="sponsored nofollow noopener noreferrer"`.
- Be clearly covered by the affiliate disclosure.
- Use descriptive button labels rather than “Buy Now.”
- Never be presented as guaranteed to produce results.
- Never be included in cold outreach emails.
- Never be used without disclosure.

Recommended CTA labels:

- Explore Zapmail
- Explore ReachInbox
- Explore Instantly
- See How It Works
- Visit Platform

Track clicks with an analytics event such as `affiliate_tool_click`, including the tool name as an event property.


# 6. Testimonial Area

**Section label:**
Client Feedback

**Heading:**
What Clients Say About Working With Me

**Introduction:**
My work has included both short-term projects and long-term client relationships across development, lead generation, and outreach.

Do not create fake testimonials. Select three strong, relevant reviews from Upwork and use this format:

### Testimonial One

> “[Paste an exact client review about your development work here.]”

**Client information:**
Verified Upwork Client
Full-Stack Web Development

### Testimonial Two

> “[Paste an exact review mentioning communication, reliability, or quality here.]”

**Client information:**
Verified Upwork Client
Long-Term Collaboration

### Testimonial Three

> “[Paste an exact review about lead generation or outreach here.]”

**Client information:**
Verified Upwork Client
B2B Lead Generation

**Button below testimonials:**
View My Upwork Profile

# 7. Pricing Table

Keep the public pricing focused on development. Cold outreach pricing depends heavily on mailbox volume, data requirements, and campaign scope.

## Basic

**Package name:**
Landing Page

**Price:**
Starting at $750

**Description:**
For professionals and small businesses that need a focused, conversion-oriented online presence.

**Includes:**

* One custom landing page
* Up to six sections
* Responsive development
* Contact or lead form
* Basic SEO metadata
* Performance checks
* Deployment assistance
* Two revision rounds

**Estimated timeline:**
7–10 business days

**Button:**
Choose Basic

## Standard

**Package name:**
Business Website

**Price:**
Starting at $2,000

**Description:**
For businesses that need a complete website to present their services, work, and expertise.

**Includes:**

* Up to seven custom pages
* Responsive UI development
* Contact and inquiry forms
* Basic CMS or database integration
* Analytics integration
* On-page SEO setup
* Performance optimization
* Three revision rounds
* Deployment assistance

**Estimated timeline:**
2–4 weeks

**Button:**
Choose Standard

**Badge:**
Most Popular

## Premium

**Package name:**
Custom Web Application

**Price:**
Starting at $5,000

**Description:**
For businesses and founders building a custom SaaS product, dashboard, marketplace, or MVP.

**Includes:**

* Custom application architecture
* Frontend and backend development
* Authentication and user roles
* Database development
* Dashboards and workflows
* API and third-party integrations
* Testing and deployment
* Technical documentation
* Post-launch support plan

**Estimated timeline:**
4–8+ weeks

**Button:**
Discuss Your Application

**Pricing note:**
Every project has different requirements. Final pricing and delivery time are confirmed after reviewing the complete scope.

**Outreach pricing block:**
Need cold email outreach, lead generation, or LinkedIn prospecting? These services are quoted separately based on your target market, lead volume, infrastructure, and level of campaign management.

**Button:**
Request an Outreach Quote

# 8. CTA Section — removed

The standalone CTA band sat directly above the contact form and read as the same
ask twice. It has been removed from the page. Its description line is retained as
the lead-in above the contact form:

> Tell me what you’re working on, where you’re currently stuck, and what result you want to achieve. I’ll review the details and recommend the clearest next step.

# 9. Contact Area

**Section label:**
Contact

**Heading:**
Tell Me About Your Project

**Description:**
Need a full-stack developer, a cold email specialist, or help building a targeted prospecting system? Send me a few details about your project and I’ll respond directly.

### Contact form

**Name**
Placeholder: Your name

**Work email**
Placeholder: `you@company.com`

**Company**
Placeholder: Company name (optional)

**Service needed**

* Full-Stack Web Development
* Next.js or React Development
* MERN Stack Development
* SaaS or MVP Development
* Cold Email Outreach
* Lead Generation
* LinkedIn Outreach
* Other

**Estimated budget**

* Under $1,000
* $1,000–$3,000
* $3,000–$5,000
* $5,000–$10,000
* $10,000+
* Not sure yet

**Project details**
Placeholder: Tell me what you’re building, who it is for, and what outcome you need.

**Submit button:**
Send Project Details

**Alternative contact text:**
Prefer email? Contact me directly at `masum@masumdev.com`.

# 10. Footer

**Name:**
MasumDev

**Positioning statement:**
Full-Stack Developer and B2B Outreach Specialist building useful digital products and practical growth systems for businesses worldwide.

**Quick links:**

* About
* Services
* Projects
* Testimonials
* Pricing
* Contact
* Résumé

**Social links:**

* LinkedIn: `https://www.linkedin.com/in/almasumbd`
* X: `https://x.com/almasumbd`
* GitHub: `https://github.com/masumgaibandha`
* Upwork: `https://www.upwork.com/freelancers/~01a5eccfaf40a8a065?viewMode=1`

Do not display an Instagram link until a verified profile URL is provided.

**Copyright:**
© 2026 MasumDev. All rights reserved.

**Affiliate disclosure:**
Some links on this website may be affiliate links. If you purchase through one of these links, I may receive a commission at no additional cost to you. I only recommend tools I use or genuinely trust.

# SEO Metadata

### Homepage title

```text
Full-Stack Developer & B2B Outreach | MasumDev
```

### Meta description

```text
Full-stack developer building fast Next.js and MERN web apps. I also help B2B teams with cold email outreach, lead generation, and LinkedIn prospecting.
```

### Canonical URL

```text
https://masumdev.com/
```

### Open Graph content

```text
OG Title: Full-Stack Developer & B2B Outreach | MasumDev

OG Description: Explore full-stack web applications, SaaS products, and B2B outreach services from Abdullah Al Masum.

OG URL: https://masumdev.com/

OG Type: website

OG Image: Generate it with Next.js using `app/opengraph-image.tsx` or add a real file at `app/opengraph-image.jpg`.

OG Image Alt: Abdullah Al Masum — Full-Stack Developer and B2B Outreach Specialist
```

### Search phrases to target naturally

**Homepage:**

* Full-stack developer for hire
* Freelance full-stack developer
* Next.js and MERN developer

**Development service page:**

* Next.js developer
* React developer
* MERN stack developer
* SaaS application developer
* Full-stack web development services

**Outreach service page:**

* Cold email outreach specialist
* Email deliverability consultant
* Cold email campaign manager

**Lead generation page:**

* B2B lead generation specialist
* Apollo lead generation
* LinkedIn Sales Navigator specialist
* Prospect list building service

Do not force every phrase into the homepage. Google recommends concise, descriptive titles and specifically warns against keyword stuffing. Each important page should have its own title and purpose. [Google Search Central](https://developers.google.com/search/docs/appearance/title-link)

# Recommended SEO Page Structure

For stronger search visibility, create separate pages:

| URL                                | Primary topic                                   |
| ---------------------------------- | ----------------------------------------------- |
| `/`                                | Personal portfolio and overall positioning      |
| `/services/full-stack-development` | Full-stack, Next.js, React and MERN development |
| `/services/cold-email-outreach`    | Cold email setup, deliverability and management |
| `/services/lead-generation`        | B2B prospect research and list building         |
| `/projects/dentflow`               | DentFlow case study                             |
| `/projects/skillpath-ai`           | SkillPath AI case study                         |
| `/projects/taskforge`              | TaskForge case study                            |
| `/resources`                       | Affiliate tools and recommendations             |
| `/contact`                         | Project inquiry page                            |

Give every page a unique description. Google explains that page-specific descriptions are more useful than repeating the same description throughout a website. [Google Search Central](https://developers.google.com/search/docs/appearance/snippet)

# Person Structured Data

Use the verified social profiles below. Do not add an `image` property until a real headshot is publicly available on `masumdev.com`.

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "url": "https://masumdev.com/",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://masumdev.com/#person",
    "name": "Abdullah Al Masum",
    "alternateName": "MasumDev",
    "url": "https://masumdev.com/",
    "jobTitle": [
      "Full-Stack Web Developer",
      "Cold Email Outreach Specialist",
      "B2B Lead Generation Specialist"
    ],
    "description": "Full-stack web developer and B2B outreach specialist building scalable web applications and client acquisition systems.",
    "nationality": {
      "@type": "Country",
      "name": "Bangladesh"
    },
    "knowsAbout": [
      "Next.js",
      "React",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "MERN Stack",
      "Cold Email Outreach",
      "Email Deliverability",
      "B2B Lead Generation",
      "LinkedIn Outreach"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/almasumbd",
      "https://github.com/masumgaibandha",
      "https://www.upwork.com/freelancers/~01a5eccfaf40a8a065?viewMode=1",
      "https://x.com/almasumbd"
    ]
  }
}
```

Google’s `ProfilePage` documentation uses a person as the page’s `mainEntity`; structured data should contain only accurate, visible information. [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/profile-page)

# Final SEO Checklist

* Use only one H1 on each page.
* Give every page a unique title and description.
* Add descriptive alt text to every meaningful image.
* Convert project images to WebP or AVIF.
* Add canonical URLs.
* Create `sitemap.xml` and `robots.txt`.
* Submit the sitemap through Google Search Console.
* Add Google Analytics or privacy-friendly analytics.
* Link service pages to relevant project case studies.
* Make the navigation, forms, and buttons keyboard accessible.
* Keep mobile performance and Core Web Vitals strong.
* Never fabricate reviews, clients, statistics, or project results.

Place the sitemap at the root and submit it through Search Console so you can monitor processing errors and crawler access. [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
