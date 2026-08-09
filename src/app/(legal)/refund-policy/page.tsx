import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { refundPolicy } from "@/data/legal-content";

export const metadata: Metadata = {
  title: { absolute: refundPolicy.seoTitle },
  description: refundPolicy.metaDescription,
  alternates: { canonical: "/refund-policy" },
  openGraph: {
    type: "article",
    url: "/refund-policy",
    title: refundPolicy.seoTitle,
    description: refundPolicy.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: refundPolicy.seoTitle,
    description: refundPolicy.metaDescription,
  },
};

export default function RefundPolicyPage() {
  return <LegalPage content={refundPolicy} />;
}
