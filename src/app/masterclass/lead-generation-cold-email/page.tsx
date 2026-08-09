import { AudienceFit } from "@/components/masterclass/AudienceFit";
import { CurriculumDaySection } from "@/components/masterclass/CurriculumDaySection";
import { ExpectationStory } from "@/components/masterclass/ExpectationStory";
import { Faq } from "@/components/masterclass/Faq";
import { FinalCta } from "@/components/masterclass/FinalCta";
import { Hero } from "@/components/masterclass/Hero";
import { InstructorCredibility } from "@/components/masterclass/InstructorCredibility";
import { MasterclassFooter } from "@/components/masterclass/MasterclassFooter";
import { MasterclassHeader } from "@/components/masterclass/MasterclassHeader";
import { Outcomes } from "@/components/masterclass/Outcomes";
import { Registration } from "@/components/masterclass/Registration";
import { ResultsProof } from "@/components/masterclass/ResultsProof";
import { StickyMobileCta } from "@/components/masterclass/StickyMobileCta";
import { TrustMetrics } from "@/components/masterclass/TrustMetrics";
import { Workflow } from "@/components/masterclass/Workflow";
import { curriculumDays, curriculumNote } from "@/data/masterclass-content";

export default function MasterclassSalesPage() {
  const [dayOne, dayTwo] = curriculumDays;

  return (
    <>
      <a
        href="#main"
        className="focus:bg-ink focus:text-on-dark sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:px-5 focus:py-3 focus:text-sm focus:font-medium"
      >
        মূল কনটেন্টে যান
      </a>

      <MasterclassHeader />

      {/* Bottom padding reserves room for the fixed mobile CTA bar below `md`. */}
      <main id="main" className="pb-24 md:pb-0">
        <Hero />
        <TrustMetrics />
        <ExpectationStory />
        <Outcomes />
        <CurriculumDaySection day={dayOne} tone="canvas" />
        <CurriculumDaySection day={dayTwo} tone="canvasAlt" note={curriculumNote} />
        <Workflow />
        <ResultsProof />
        <InstructorCredibility />
        <AudienceFit />
        <Registration />
        <Faq />
      </main>

      <FinalCta />
      <MasterclassFooter />
      <StickyMobileCta />
    </>
  );
}
