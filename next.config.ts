import type { NextConfig } from "next";

const OUTBOUND_BD_MASTERCLASS_URL =
  "https://outboundbd.com/masterclass/lead-generation-cold-email";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    /*
     * Both are barrel packages: a single `LuArrowRight` import otherwise pulls
     * the whole icon set into the graph, and `@heroui/react` drags react-aria
     * along with it. This rewrites them to direct per-module imports.
     */
    optimizePackageImports: ["react-icons/lu", "@heroui/react"],
  },
  /*
   * The Lead Generation & Cold Email Outreach masterclass is no longer
   * publicly hosted or promoted on MasumDev — it lives on Outbound BD now.
   * `redirects()` is checked before the filesystem router resolves a page
   * (https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects),
   * so this intercepts both paths ahead of the still-intact page at
   * `src/app/masterclass/lead-generation-cold-email/page.tsx` — that route,
   * its registration/payment/admin backend, and its legal pages are left
   * fully in place (see CLAUDE.md "Masterclass de-promotion"), just no
   * longer publicly reachable. `permanent: true` emits a genuine 308.
   * Neither source path is nested under `/masterclass/admin`, so the
   * Basic-Auth-protected admin review queue is unaffected.
   *
   * Query strings (UTM params included) are not part of `destination`, so
   * Next.js forwards them onto the redirect target automatically — no
   * manual `has`/`missing` matching or query re-assembly is needed here.
   */
  async redirects() {
    return [
      {
        source: "/masterclass/lead-generation-cold-email",
        destination: OUTBOUND_BD_MASTERCLASS_URL,
        permanent: true,
      },
      /* Legacy pluralized path — never a real MasumDev route, but redirected in case it was ever linked or bookmarked. */
      {
        source: "/masterclasses/lead-generation-cold-email",
        destination: OUTBOUND_BD_MASTERCLASS_URL,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
