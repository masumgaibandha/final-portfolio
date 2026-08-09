import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/data/legal-content";

export const metadata: Metadata = {
  title: { absolute: privacyPolicy.seoTitle },
  description: privacyPolicy.metaDescription,
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    type: "article",
    url: "/privacy-policy",
    title: privacyPolicy.seoTitle,
    description: privacyPolicy.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: privacyPolicy.seoTitle,
    description: privacyPolicy.metaDescription,
  },
};

export default function PrivacyPolicyPage() {
  return <LegalPage content={privacyPolicy} />;
}
