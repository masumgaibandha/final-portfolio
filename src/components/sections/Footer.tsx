import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { footer } from "@/data/contact";
import { navLinks, site, socialLinks } from "@/data/site";

const quickLinks = [
  ...navLinks.filter((link) => link.href !== "/#home"),
  { label: "Resources", href: "/resources" },
  { label: "RÃ©sumÃ©", href: site.resumeUrl },
];

const linkClass =
  "text-on-dark/75 hover:text-on-dark focus-visible:outline-action rounded-sm text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4";

export function Footer() {
  return (
    <footer className="bg-ink text-on-dark">
      <Container className="pt-20 pb-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="onDark" className="text-2xl" />
            <p className="text-on-dark-muted mt-5 max-w-sm leading-relaxed">
              {footer.positioning}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-body text-on-dark-muted text-xs font-semibold tracking-[0.16em] uppercase">
              Explore
            </h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-body text-on-dark-muted text-xs font-semibold tracking-[0.16em] uppercase">
              Elsewhere
            </h2>
            <ul className="mt-5 space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-on-dark-muted border-on-dark/15 mt-16 border-t pt-8 text-xs leading-relaxed">
          {footer.affiliateDisclosure}
        </p>
      </Container>

      {/*
       * Full-bleed bottom bar so the copyright reads as the page's final rule
       * rather than another item stacked in the left column.
       */}
      <div className="border-on-dark/15 border-t">
        <Container className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-on-dark-muted text-xs">{footer.copyright}</p>
          <p className="text-on-dark-muted text-xs">
            Built with Next.js &amp; Tailwind CSS Â·{" "}
            <a
              href={site.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-dark/80 hover:text-on-dark decoration-action focus-visible:outline-action rounded-sm underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              View source
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
