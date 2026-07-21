import Link from "next/link";

import { MobileNav } from "@/components/sections/MobileNav";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { navLinks, site } from "@/data/site";

export function Navbar() {
  // Solid, not translucent — the style guide rules out frosted panels.
  return (
    <header className="border-ink/8 bg-bg sticky top-0 z-50 border-b">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link
          href="/#home"
          aria-label={`${site.name} — home`}
          className="focus-visible:outline-accent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Logo className="text-xl" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted hover:text-ink focus-visible:outline-accent rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/#contact" tone="ink" className="hidden sm:inline-flex">
            Let’s Talk
          </ButtonLink>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
