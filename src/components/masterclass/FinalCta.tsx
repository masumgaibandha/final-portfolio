import { LuArrowRight } from "react-icons/lu";

import { Container } from "@/components/ui/Container";
import { finalCta } from "@/data/masterclass-content";

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="bg-ink text-on-dark py-14 md:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="final-cta-heading"
            className="font-heading font-bengali text-2xl tracking-tight text-balance md:text-3xl"
          >
            {finalCta.heading}
          </h2>
          <p className="text-on-dark-muted font-bengali mt-4 leading-relaxed md:text-lg">
            {finalCta.description}
          </p>
          <a
            href="#registration"
            className="bg-action-dark text-ink hover:brightness-110 focus-visible:outline-action-dark font-bengali mt-8 inline-flex h-13 items-center gap-2 rounded-full px-7 text-[0.95rem] font-medium transition-[filter] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {finalCta.cta}
            <LuArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
