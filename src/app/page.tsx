import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { Pricing } from "@/components/sections/Pricing";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="focus:bg-ink focus:text-bg sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:px-5 focus:py-3 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>

      <Footer />
      <RevealOnScroll />
    </>
  );
}
