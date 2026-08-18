import { randomUUID } from "node:crypto";

/**
 * Unpredictable public identifier, safe to return to the browser and put in
 * a URL. Never a MongoDB `_id` (ObjectIds are sequential-ish and leak
 * creation order) and never derived from email/phone/time.
 *
 * Registrations use a different, human-friendly ref instead
 * (`MC-2026-000123` — see `generateHumanRegistrationRef()` in
 * `counters-repository.ts`) since that one is shown to students and to the
 * admin verification page; orders stay an internal, opaque `ord_<uuid>`.
 */
export function generatePublicOrderRef(): string {
  return `ord_${randomUUID()}`;
}
