import type { NextConfig } from "next";

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
};

export default nextConfig;
