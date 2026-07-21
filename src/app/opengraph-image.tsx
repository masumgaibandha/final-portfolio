import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Abdullah Al Masum — Full-Stack Developer and B2B Outreach Specialist";

/*
 * Generated rather than shipped as a file so the card stays in sync with the
 * palette. Only system fonts are used — `next/font` is not available here.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "radial-gradient(120% 90% at 85% 5%, #FFEEB8 0%, rgba(255,227,196,0.7) 45%, rgba(255,255,255,0) 75%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: "#FC7E07",
            }}
          />
          <span
            style={{
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#625E5B",
            }}
          >
            MasumDev
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 82,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#020000",
            }}
          >
            Abdullah Al Masum
          </span>
          <span
            style={{
              marginTop: 20,
              fontSize: 38,
              lineHeight: 1.3,
              color: "#625E5B",
            }}
          >
            Full-Stack Developer &amp; B2B Outreach Specialist
          </span>
        </div>

        <span style={{ fontSize: 26, color: "#625E5B" }}>
          Next.js · React · MERN · Cold Email · Lead Generation
        </span>
      </div>
    ),
    size,
  );
}
