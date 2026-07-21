import type { Testimonial } from "@/types";

export const testimonialsIntro = {
  label: "Client Feedback",
  heading: "What Clients Say About Working With Me",
  description:
    "My work has included both short-term projects and long-term client relationships across development, lead generation, and outreach.",
} as const;

/*
 * Transcribed verbatim from the review screenshots in `resources/`, including
 * the clients' own typos. Client names are withheld because the source
 * screenshots redact them — do not invent any. Every quote here is real;
 * nothing in this file may be written from scratch.
 */
export const testimonials: readonly Testimonial[] = [
  {
    id: "upwork-cold-email-campaigns",
    quote:
      "Great freelancer. Excellent work on cold email campaigns. We had 60 inboxes and all of them had a 95%+ health score, and over a 50% open rate. Very good!",
    attribution: "Verified Upwork Client",
    context: "Cold Email Campaigns",
    source: "Upwork",
  },
  {
    id: "fiverr-technical-detail",
    quote:
      "Masum was very good to work with. He provided us with many technical details we could not have received without his knowledge and experience. I probably asked more questions than the average customer and he was always professional and very responsive. I would definitely recommend him and work with him again.",
    attribution: "Verified Fiverr Client · United States",
    context: "Cold Email Infrastructure",
    source: "Fiverr",
  },
  {
    id: "upwork-multiple-domains",
    quote:
      "Masum was a pleasure to work with -- we had the challenging task of establishing multiple domains for cold outreach for a SaaS startup and Masum handled everything, including gathering leads, setting up the platform (Instantly), and managing the outreach. Hit some snafus with deliverability.. the only downside, but not preventable. Overall he was a pleasure to work with.",
    attribution: "Verified Upwork Client",
    context: "Instantly.AI Setup & Email Outreach Optimization",
    source: "Upwork",
  },
  {
    id: "fiverr-repeat-client",
    quote:
      "Excellent experience working together. Communication was clear, delivery was on time, and the quality of work met expectations. Professional, responsive, and easy to collaborate with. Would recommend and work together again.",
    attribution: "Verified Fiverr Client · United States",
    context: "Repeat Client · Cold Emails",
    source: "Fiverr",
  },
  {
    id: "upwork-sixth-project",
    quote:
      "This is out 6th project with Masum. Great work and responsiveness as always",
    attribution: "Verified Upwork Client",
    context: "AI Email Campaign Specialist — Saleshandy / Instantly",
    source: "Upwork",
  },
  {
    id: "fiverr-amazing-as-always",
    quote:
      "Amazing as always. really wants to help, always available to make changes. highly recommend.",
    attribution: "Verified Fiverr Client · United Kingdom",
    context: "Repeat Client · Cold Emails",
    source: "Fiverr",
  },
];
