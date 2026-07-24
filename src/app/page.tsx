import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { OutreachStack } from "@/components/sections/OutreachStack";
import { Pricing } from "@/components/sections/Pricing";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="focus:bg-ink focus:text-on-dark sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:px-5 focus:py-3 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        {/*
         * Development leads: Services → Projects → Testimonials establish the
         * primary positioning before the outreach tooling appears.
         */}
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Testimonials />
        <OutreachStack />
        <Pricing />
        <Contact />
      </main>

      <Footer />
      <RevealOnScroll />
    </>
  );
}
