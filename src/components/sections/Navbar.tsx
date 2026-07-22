import Link from "next/link";

import { MobileNav } from "@/components/sections/MobileNav";
import { NavLinks } from "@/components/sections/NavLinks";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/data/site";

export function Navbar() {
  // Solid, not translucent — the style guide rules out frosted panels.
  return (
    <header className="border-hairline bg-canvas sticky top-0 z-50 border-b">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link
          href="/#home"
          aria-label={`${site.name} — home`}
          className="focus-visible:outline-action rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Logo className="text-xl" />
        </Link>

        <div className="flex items-center gap-2 lg:flex-1 lg:justify-end lg:gap-8">
          <NavLinks />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
