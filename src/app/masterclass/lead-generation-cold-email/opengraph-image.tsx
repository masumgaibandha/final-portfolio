import { ImageResponse } from "next/og";

import { resolvePriceBDT } from "@/lib/masterclass/constants";

/*
 * Per-route file convention — Next.js only applies this to this exact
 * segment, so the homepage's own `src/app/opengraph-image.tsx` is
 * untouched. `ImageResponse` is built into Next.js (no new dependency);
 * this was previously missing entirely, so a share in Messenger/WhatsApp
 * rendered a blank link card.
 *
 * English copy, deliberately: satori (the renderer behind `ImageResponse`)
 * ships a Latin-only default font, and Bengali glyphs would need an
 * explicitly loaded font file fetched over the network — a build-time
 * dependency this project's environment can't be assumed to have. The page
 * itself stays fully Bengali; this is only the small preview card shown in
 * a link unfurl, where a working Latin image beats a Bengali one that risks
 * rendering as missing glyphs or breaking the build.
 */

export const alt = "Lead Generation & Cold Email Outreach Masterclass — MasumDev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const priceBDT = resolvePriceBDT();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#FFF9D9",
          color: "#020000",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>MasumDev</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 980 }}>
          <div style={{ display: "flex", fontSize: 26, color: "#625E5B" }}>2-Day LIVE Masterclass</div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, lineHeight: 1.15 }}>
            Lead Generation &amp; Cold Email Outreach
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 30 }}>
          <div
            style={{
              display: "flex",
              background: "#FC7E07",
              color: "#FFFFFF",
              padding: "14px 32px",
              borderRadius: 999,
              fontWeight: 600,
            }}
          >
            {`Tk ${priceBDT.toLocaleString("en-US")}`}
          </div>
          <div style={{ display: "flex", color: "#625E5B" }}>Oct 2–3, 2026</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
