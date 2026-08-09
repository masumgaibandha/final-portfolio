import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { termsAndConditions } from "@/data/legal-content";

export const metadata: Metadata = {
  title: { absolute: termsAndConditions.seoTitle },
  description: termsAndConditions.metaDescription,
  alternates: { canonical: "/terms-and-conditions" },
  openGraph: {
    type: "article",
    url: "/terms-and-conditions",
    title: termsAndConditions.seoTitle,
    description: termsAndConditions.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: termsAndConditions.seoTitle,
    description: termsAndConditions.metaDescription,
  },
};

export default function TermsAndConditionsPage() {
  return <LegalPage content={termsAndConditions} />;
}
