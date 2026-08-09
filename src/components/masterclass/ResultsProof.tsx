import Image from "next/image";

import {
  MasterclassSection,
  eyebrowClass,
  eyebrowDotClass,
} from "@/components/masterclass/MasterclassSection";
import { resultsProof } from "@/data/masterclass-content";

/* These two assets carry more detail (a chart, three feedback rows), so they take the full row and a taller frame. */
const wideAssetIds = new Set(["campaign-chart", "client-feedback"]);

export function ResultsProof() {
  return (
    <MasterclassSection id="results" tone="canvasAlt" labelledBy="results-heading">
      <p className={eyebrowClass}>
        <span aria-hidden="true" className={eyebrowDotClass} />
        {resultsProof.label}
      </p>
      <h2
        id="results-heading"
        className="type-section font-bengali text-ink mt-4 max-w-2xl text-balance"
      >
        {resultsProof.heading}
      </h2>

      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {resultsProof.assets.map((asset) => {
          const isWide = wideAssetIds.has(asset.id);

          return (
            <li key={asset.id} className={isWide ? "md:col-span-2" : undefined}>
              <figure className="border-hairline bg-surface flex h-full flex-col border p-5">
                {/*
                 * Fixed-height frame + `fill`/`object-contain` rather than
                 * natural `h-auto` sizing: the four source screenshots have
                 * wildly different native aspect ratios (a short wide stat
                 * card vs. a tall feedback list), so natural sizing made the
                 * grid row heights uneven. `object-contain` never crops —
                 * it letterboxes inside the frame instead.
                 */}
                <div
                  className={`bg-canvas-alt relative overflow-hidden rounded-sm ${
                    isWide ? "h-64 sm:h-80" : "h-36 sm:h-40"
                  }`}
                >
                  <Image
                    src={asset.src}
                    alt={asset.alt}
                    fill
                    sizes={
                      isWide
                        ? "(min-width: 768px) 900px, 100vw"
                        : "(min-width: 768px) 440px, 100vw"
                    }
                    className="object-contain"
                  />
                </div>
                <figcaption className="text-ink-muted font-bengali mt-4 text-sm leading-relaxed">
                  {asset.caption}
                </figcaption>
                <a
                  href={asset.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-action focus-visible:outline-action decoration-action font-bengali mt-3 inline-flex min-h-11 w-fit items-center rounded-sm text-sm font-medium underline decoration-2 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {resultsProof.viewFullSizeLabel}
                  <span className="sr-only"> (নতুন ট্যাবে খুলবে)</span>
                </a>
              </figure>
            </li>
          );
        })}
      </ul>
    </MasterclassSection>
  );
}
