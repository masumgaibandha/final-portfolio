# Portfolio Content and Project Guidelines

## Project Overview

Build a premium, modern portfolio website for Abdullah Al Masum. Position him exclusively as a full-stack web developer — no other line of work is part of the public positioning.

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

Your positioning is:

> Full-stack web developer, building production-ready web applications, dashboards, platforms, APIs, authentication systems, and responsive user experiences.

**Repositioning note (2026):** the site previously carried a mixed "full-stack developer + B2B cold email outreach specialist" identity, with an affiliate "Recommended Outreach Tools" section, an outreach-flavored Testimonials section, and a cold-email/lead-generation case study among the featured projects. All of that was removed so the public portfolio reads as development-only. The masterclass sales page's own content was left untouched (rewriting it would misrepresent that separate product), but legacy MasumDev traffic to `/masterclass/lead-generation-cold-email` (and the pluralized `/masterclasses/lead-generation-cold-email`) now permanently redirects to Outbound BD's own live page — see `CLAUDE.md` § "Masterclass de-promotion" for the full reasoning.

# 1. Navbar

**Logo/Name:**
MasumDev

**Navigation:**

* Home
* About
* Services
* Projects
* Blog
* Pricing
* Contact

**Navbar button:**
Let’s Talk

# 2. Hero Area

**Small heading:**
Full-Stack Web Developer

**Main heading (H1):**
I Build Full-Stack Web Products That Solve Real Business Problems.

**Description:**
I’m Abdullah Al Masum, a full-stack web developer. I design and develop fast, secure, scalable web applications with Next.js, React, Node.js, MongoDB, and modern TypeScript — from responsive interfaces to production-ready APIs and dashboards.

**Primary button:**
View My Projects

**Secondary button:**
Discuss Your Project

**Résumé button:**
Download My Résumé

**Résumé URL:**
`/resources/Abdullah-Al-Masum-Resume.pdf`

**Availability text:**
Available for selected freelance and long-term projects.

**Trust indicators:**

* 3 Featured Full-Stack Projects
* 15+ Technologies Used
* Full-Stack — Next.js, React & Node.js

Do not reintroduce dollar-earnings or hours-worked figures here — those were earned across a mix of development and non-development freelance work and cannot be honestly attributed to web development alone.

# 3. About Area

**Section label:**
About Me

**Heading:**
Full-Stack Development Experience With a Practical Mindset

**Content:**
I’m a full-stack web developer based in Bangladesh, working with clients worldwide.

I build responsive websites, SaaS applications, dashboards, marketplaces, APIs, and custom business platforms. My primary technologies are JavaScript, TypeScript, React, Next.js, Node.js, Express.js, and MongoDB.

My work covers the full stack — from designing accessible, responsive interfaces to building authentication, role-based dashboards, database schemas, and third-party integrations like payments. I care about shipping applications that hold up under real usage, not just demos.

Whatever the project, my focus is the same: understand the real problem, create a practical solution, and communicate clearly throughout.

### Technical skills

Mirrors `src/data/skills.ts` exactly — do not add a technology here that isn't genuinely used and reflected there.

**Frontend Development**

* HTML5
* CSS3
* JavaScript
* TypeScript
* React.js
* Next.js
* Tailwind CSS

**Backend & Database**

* Node.js
* Express.js
* MongoDB
* REST APIs

**Tools & Deployment**

* Git
* GitHub
* Vercel
* Netlify

# 4. Services Area

**Section label:**
Services

**Heading:**
How I Can Help Your Business

### Full-Stack Web Applications

I build complete web applications end to end — from the database schema to the deployed frontend — using Next.js, React, Node.js, Express.js, and MongoDB.

**Services include:**

* Next.js App Router applications
* SaaS and MVP development
* Admin and role-based dashboards
* Authentication and protected routes
* Payment integrations
* Database schema and query design
* Deployment and production readiness

**Button:**
Discuss a Development Project

### Frontend Development

I build responsive, accessible React interfaces that hold up across devices — from marketing pages to complex, data-driven dashboards.

**Services include:**

* Responsive React and Next.js interfaces
* Component architecture and reusable UI
* Tailwind CSS and HeroUI implementation
* Client-side form validation
* Accessibility and responsive QA
* Performance optimization

**Button:**
Discuss a Frontend Project

### Backend APIs and Database Systems

I design and build the backend systems that power an application — REST APIs, database models, and the business logic connecting them.

**Services include:**

* REST API design and integration
* MongoDB schema and query implementation
* Authentication and role-based access control
* Third-party API integrations
* Rate limiting and request validation
* Admin workflows

**Button:**
Discuss a Backend Project

### Product Engineering and Optimization

For an existing application, I improve what's already shipped — performance, accessibility, code quality, and features that need to be added or fixed.

**Services include:**

* Performance optimization
* Accessibility and responsive QA
* Codebase review and refactoring
* New feature implementation
* Bug fixes and stability improvements
* Deployment and CI improvements

**Button:**
Discuss an Existing Application

# 5. Project Area

**Section label:**
Selected Work

**Heading:**
Products I’ve Built

**Introduction:**
A selection of SaaS products and web applications that demonstrate how I approach full-stack development and product problems.

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

**Removed:** the "B2B Outreach System" project (cold email/lead-generation case study) was dropped from featured work as part of the full-stack-only repositioning — it demonstrated outreach work, not software development. Do not re-add it, or any other non-development case study, to this section.

# 6. Testimonial Area — removed

The Testimonials section was removed from the homepage. Every testimonial transcribed from the source screenshots (`resources/upwork-client-feedback-*.png`, `resources/fiverr-client-feedback-*.png`) was about cold-email/outreach work — none were about web development — so there was no genuine development testimonial to keep, and inventing one is not allowed.

If genuine, verifiable development testimonials become available later, re-add a Testimonials section using this format:

> “[Paste an exact client review about your development work here.]”

**Client information:**
Verified Upwork Client (or Fiverr)
[Specific development context, e.g. "Full-Stack Web Development"]

Do not create fake testimonials, and do not repurpose an outreach-work quote by rewriting it to sound like development work.

# Recommended Outreach Tools — removed

The affiliate "My Outreach Stack" homepage section and the `/resources` page (Zapmail, ReachInbox, Instantly recommendations, comparison table, and affiliate disclosure) were removed entirely as part of the full-stack-only repositioning. Affiliate tooling for cold-email workflows has no place in a development-only portfolio.

If an affiliate/resources section is ever reintroduced, it must be for genuinely developer-relevant tools (not outreach tooling), must never appear in the hero/About/Services/primary positioning, must carry its disclosure directly beneath the tool cards (not only in the footer), and every affiliate link must use `rel="sponsored nofollow noopener noreferrer"` and open in a new tab.

# 7. Pricing Table

Keep the public pricing focused on development only. Do not add a separate outreach-pricing block — that offering no longer exists on this site.

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
Need a full-stack developer for a new application, or help improving an existing one? Send me a few details about your project and I’ll respond directly.

### Contact form

**Name**
Placeholder: Your name

**Work email**
Placeholder: `you@company.com`

**Company**
Placeholder: Company name (optional)

**Service needed**

* Full-Stack Web Application
* Frontend Development
* Backend/API Development
* Dashboard or Admin Panel
* Existing Application Improvement
* Other Development Project

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
Full-Stack Web Developer building fast, secure, scalable web applications for businesses worldwide.

**Quick links:**

* About
* Services
* Projects
* Blog
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

No affiliate disclosure is needed in the footer — the affiliate/outreach-tools content it used to cover was removed entirely.

# SEO Metadata

### Homepage title

```text
Full-Stack Web Developer | MasumDev
```

### Meta description

```text
Full-stack web developer building fast, scalable web applications with Next.js, React, Node.js, and MongoDB.
```

### Canonical URL

```text
https://masumdev.com/
```

### Open Graph content

```text
OG Title: Full-Stack Web Developer | MasumDev

OG Description: Explore full-stack web applications and SaaS products built by Abdullah Al Masum with Next.js, React, Node.js, and MongoDB.

OG URL: https://masumdev.com/

OG Type: website

OG Image: Generate it with Next.js using `app/opengraph-image.tsx` or add a real file at `app/opengraph-image.jpg`.

OG Image Alt: Abdullah Al Masum — Full-Stack Web Developer
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

Do not force every phrase into the homepage. Google recommends concise, descriptive titles and specifically warns against keyword stuffing. Each important page should have its own title and purpose. [Google Search Central](https://developers.google.com/search/docs/appearance/title-link)

# Recommended SEO Page Structure

For stronger search visibility, create separate pages:

| URL                                | Primary topic                                   |
| ----------------------------------- | ------------------------------------------------ |
| `/`                                | Personal portfolio and overall positioning      |
| `/services/full-stack-development` | Full-stack, Next.js, React and MERN development |
| `/projects/dentflow`               | DentFlow case study                             |
| `/projects/skillpath-ai`           | SkillPath AI case study                         |
| `/projects/taskforge`              | TaskForge case study                            |
| `/contact`                         | Project inquiry page                            |

`/services/cold-email-outreach`, `/services/lead-generation`, and `/resources` (affiliate tools) are intentionally absent — those offerings and the affiliate content behind them were removed from the site.

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
    "jobTitle": ["Full-Stack Web Developer"],
    "description": "Full-stack web developer building scalable web applications with Next.js, React, Node.js, and MongoDB.",
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
      "REST APIs",
      "Tailwind CSS"
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
