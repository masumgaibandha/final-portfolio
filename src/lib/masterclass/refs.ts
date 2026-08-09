import { randomUUID } from "node:crypto";

/**
 * Unpredictable public identifiers, safe to return to the browser and put in
 * a URL. Never a MongoDB `_id` (ObjectIds are sequential-ish and leak
 * creation order) and never derived from email/phone/time.
 */
export function generatePublicRegistrationRef(): string {
  return `reg_${randomUUID()}`;
}

export function generatePublicOrderRef(): string {
  return `ord_${randomUUID()}`;
}
