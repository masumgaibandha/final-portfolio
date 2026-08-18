/*
 * The real `server-only` package throws when imported outside Next.js's
 * server compiler context — which is exactly what running these files under
 * plain Node/Vitest is. Aliased in for tests only (see vitest.config.ts);
 * production code still imports the real package via Next.js's build.
 */
export {};
