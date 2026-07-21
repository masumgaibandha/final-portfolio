import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";

import { site } from "@/data/site";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Full-Stack Developer & B2B Outreach | MasumDev",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  alternates: { canonical: "/" },
  keywords: [
    "full-stack developer",
    "freelance full-stack developer",
    "Next.js developer",
    "React developer",
    "MERN stack developer",
    "cold email outreach specialist",
    "B2B lead generation specialist",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "Full-Stack Developer & B2B Outreach | MasumDev",
    description:
      "Explore full-stack web applications, SaaS products, and B2B outreach services from Abdullah Al Masum.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Full-Stack Developer & B2B Outreach | MasumDev",
    description:
      "Explore full-stack web applications, SaaS products, and B2B outreach services from Abdullah Al Masum.",
    creator: "@almasumbd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/*
 * `image` is deliberately absent until a headshot is served from masumdev.com —
 * structured data must only describe what is verifiably published.
 */
const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${site.url}/`,
  mainEntity: {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.fullName,
    alternateName: site.name,
    url: `${site.url}/`,
    jobTitle: [
      "Full-Stack Web Developer",
      "Cold Email Outreach Specialist",
      "B2B Lead Generation Specialist",
    ],
    description:
      "Full-stack web developer and B2B outreach specialist building scalable web applications and client acquisition systems.",
    nationality: { "@type": "Country", name: "Bangladesh" },
    knowsAbout: [
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
      "LinkedIn Outreach",
    ],
    sameAs: [
      "https://www.linkedin.com/in/almasumbd",
      "https://github.com/masumgaibandha",
      site.upworkUrl,
      "https://x.com/almasumbd",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          // Static, author-controlled JSON — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
        />
      </body>
    </html>
  );
}
