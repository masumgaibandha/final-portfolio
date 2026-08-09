import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";

import { masterclassMeta } from "@/data/masterclass-content";

/*
 * Route-scoped Bengali font. Next.js only lets the root layout render
 * <html>/<body>, so this can't replace the root font stack — it's applied to
 * a wrapper div below instead, via the `--font-hind-siliguri` variable and
 * the `font-bengali` utility (see globals.css). The portfolio, blog and
 * resources routes keep Playfair Display/Poppins untouched.
 */
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: masterclassMeta.seoTitle },
  description: masterclassMeta.metaDescription,
  alternates: { canonical: "/masterclass/lead-generation-cold-email" },
  /*
   * Not open for public registration yet — checkout is disabled (Phase 1 is
   * UI-only). Keep this out of search results and off-limits to crawlers
   * following links to it until Phase 2 ships a working checkout.
   */
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: "/masterclass/lead-generation-cold-email",
    title: masterclassMeta.seoTitle,
    description: masterclassMeta.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: masterclassMeta.seoTitle,
    description: masterclassMeta.metaDescription,
  },
};

export default function MasterclassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="bn" className={`${hindSiliguri.variable} font-bengali`}>
      {children}
    </div>
  );
}
