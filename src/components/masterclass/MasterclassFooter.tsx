import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { footer, header } from "@/data/masterclass-content";

/** Deliberately not the portfolio Footer — no social links, no full sitemap. */
export function MasterclassFooter() {
  return (
    <footer className="bg-ink text-on-dark">
      <Container className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between md:py-10">
        <div>
          <span className="font-heading text-lg font-bold tracking-[-0.02em]">
            {header.wordmark}
          </span>
          <p className="text-on-dark-muted font-bengali mt-1.5 max-w-md text-sm leading-relaxed">
            {footer.positioning}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <Link
            href="/"
            className="text-on-dark hover:text-action-dark focus-visible:outline-action-dark font-bengali rounded-sm text-sm font-medium underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {footer.backToPortfolio}
          </Link>
          <p className="text-on-dark-muted font-bengali text-xs">
            {footer.copyright}
          </p>
        </div>
      </Container>
    </footer>
  );
}
