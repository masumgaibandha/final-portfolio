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

/*
 * `optional` rather than `swap` for the body face. The hero paragraph is the
 * LCP element on mobile (the portrait sits below the fold there), and a late
 * swap repainted it at 3.6s against a 1.2s FCP. `optional` gives the font a
 * short window and otherwise keeps the metric-matched fallback for that page
 * view, so the largest paint lands with the first paint. On any normal
 * connection Poppins still wins the race and renders as designed.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Full-Stack Web Developer | MasumDev",
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
    "Node.js developer",
    "MERN stack developer",
    "MongoDB developer",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "Full-Stack Web Developer | MasumDev",
    description:
      "Explore full-stack web applications and SaaS products built by Abdullah Al Masum with Next.js, React, Node.js, and MongoDB.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Full-Stack Web Developer | MasumDev",
    description:
      "Explore full-stack web applications and SaaS products built by Abdullah Al Masum with Next.js, React, Node.js, and MongoDB.",
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
    jobTitle: ["Full-Stack Web Developer"],
    description:
      "Full-stack web developer building scalable web applications with Next.js, React, Node.js, and MongoDB.",
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
      "REST APIs",
      "Tailwind CSS",
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
