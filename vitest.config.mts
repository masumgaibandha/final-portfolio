import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/*
 * Node environment only — every test in this suite targets server-side
 * business logic (validation, pricing, repositories, API route branching),
 * never a rendered React component, so no jsdom/testing-library is needed.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./src/test/server-only-stub.ts", import.meta.url)),
    },
  },
});
