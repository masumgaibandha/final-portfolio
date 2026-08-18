/**
 * Pure, dependency-free constant-time string comparison — deliberately has
 * no `node:crypto` import so it works unchanged in both the Edge Runtime
 * (`middleware.ts`) and the Node.js runtime (`admin-auth.ts`'s
 * `requireMasterclassAdmin()`). Originally lived only in `middleware.ts`;
 * extracted here so both credential-checking call sites share one
 * implementation instead of two copies drifting apart.
 *
 * Every character is compared regardless of where a mismatch occurs, so an
 * attacker can't learn how many leading characters they guessed correctly
 * from response timing. The credentials compared here are fixed-length
 * operator-chosen values, not secrets derived from per-request data, so the
 * early `return false` on a length mismatch does not leak anything
 * meaningful.
 */
export function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
