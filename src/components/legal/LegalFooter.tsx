import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { legalPageLinks } from "@/data/legal-content";
import { site } from "@/data/site";

export function LegalFooter() {
  return (
    <footer className="bg-ink text-on-dark">
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-10">
        <div>
          <span className="font-heading text-lg font-bold tracking-[-0.02em]">MasumDev</span>
          <p className="text-on-dark-muted font-bengali mt-1.5 max-w-md text-sm leading-relaxed">
            আব্দুল্লাহ আল মাসুম — Cold Email Outreach ও B2B Lead Generation বিশেষজ্ঞ।
          </p>
          <a
            href={`mailto:${site.email}`}
            className="text-on-dark hover:text-action-dark decoration-action-dark focus-visible:outline-action-dark mt-3 inline-flex items-center text-sm font-medium underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {site.email}
          </a>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <nav aria-label="নীতিমালা" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalPageLinks.map((link) => (
              <Link
                key={link.slug}
                href={link.href}
                className="text-on-dark hover:text-action-dark focus-visible:outline-action-dark font-bengali rounded-sm text-sm font-medium underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-on-dark-muted font-bengali text-xs">
            © ২০২৬ MasumDev। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </Container>
    </footer>
  );
}
