import { Hind_Siliguri } from "next/font/google";

/*
 * Same route-scoped Bengali font technique as the masterclass route (see
 * src/app/masterclass/lead-generation-cold-email/layout.tsx) — a route
 * group, so it adds no URL segment. Applied via a wrapper div, never on
 * <html>, so the portfolio/blog/resources routes stay untouched.
 */
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="bn" className={`${hindSiliguri.variable} font-bengali`}>
      {children}
    </div>
  );
}
