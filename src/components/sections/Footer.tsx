import Link from "next/link";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn, FaUpwork, FaXTwitter } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { footer } from "@/data/contact";
import { footerLinks, site, socialLinks } from "@/data/site";

/*
 * Brand marks come from Font Awesome rather than Lucide, the family used
 * everywhere else: Lucide carries no brand icons, so there is no LinkedIn,
 * GitHub or Upwork glyph to use. Keyed by the label in `socialLinks` — add an
 * entry here when adding a network, or its icon button will not render.
 */
const socialIcons: Record<string, IconType> = {
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
  GitHub: FaGithub,
  Upwork: FaUpwork,
};

const linkClass =
  "text-on-dark/75 hover:text-action-dark focus-visible:outline-action-dark rounded-sm text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4";

const headingClass =
  "font-body text-on-dark-muted text-xs font-semibold tracking-[0.16em] uppercase";

export function Footer() {
  return (
    <footer className="bg-ink text-on-dark">
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <Logo tone="onDark" className="text-2xl" />
            <p className="text-on-dark-muted mt-4 max-w-sm text-sm leading-relaxed">
              {footer.positioning}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="text-on-dark hover:text-action-dark decoration-action-dark focus-visible:outline-action-dark mt-4 inline-flex items-center gap-2 rounded-sm text-sm font-medium underline decoration-2 underline-offset-4 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <LuMail className="size-4 shrink-0" aria-hidden="true" />
              {site.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <h2 className={headingClass}>Explore</h2>
            {/*
             * Two columns at every width: six links become three rows, which
             * keeps this column close in height to the other two instead of
             * running twice as deep and leaving dead space beside the icons.
             */}
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headingClass}>Elsewhere</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.label];
                if (!Icon) return null;

                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      /* The label alone reads as a bare brand name to a screen
                         reader, so the destination and behaviour are spelled out. */
                      aria-label={`${link.label} profile (opens in a new tab)`}
                      className="border-on-dark/20 text-on-dark-muted hover:border-action-dark hover:text-action-dark focus-visible:outline-action-dark flex size-10 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Legally required, so it stays — set small and quiet rather than dropped. */}
        <p className="text-on-dark-muted border-on-dark/15 mt-10 border-t pt-6 text-xs leading-relaxed">
          {footer.affiliateDisclosure}
        </p>
      </Container>

      {/*
       * Full-bleed bottom bar so the copyright reads as the page's final rule
       * rather than another item stacked in the left column.
       */}
      <div className="border-on-dark/15 border-t">
        <Container className="py-5">
          <p className="text-on-dark-muted text-xs">{footer.copyright}</p>
        </Container>
      </div>
    </footer>
  );
}
