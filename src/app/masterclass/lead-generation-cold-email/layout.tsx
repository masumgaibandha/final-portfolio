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
   * This page is no longer publicly reachable: `next.config.ts` `redirects()`
   * sends this exact path (and its legacy pluralized variant) to Outbound BD
   * with a 308 before Next.js ever resolves this route, so no browser or
   * crawler ever sees this metadata. It's left as-is (rather than set to
   * `noindex`) because the route, registration backend, manual bKash/Nagad/
   * Rocket payment flow, admin queue, and legal pages are all intentionally
   * left fully intact — see CLAUDE.md "Masterclass de-promotion". `robots`
   * is omitted rather than set explicitly, inheriting the root layout's
   * default `{ index: true, follow: true }`, since it's moot either way.
   */
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
