/**
 * Thrown from inside a `session.withTransaction()` callback to abort the
 * transaction and signal an expected business outcome (not a bug) up to
 * `registration-service.ts`. Messages are static and generic on purpose —
 * safe to appear in a stack trace, but never logged with any request detail
 * attached.
 */

export class RegistrationConflictError extends Error {
  constructor() {
    super("Existing registration for this batch/email has a different phone number on file.");
    this.name = "RegistrationConflictError";
  }
}

export class IdempotencyConflictError extends Error {
  constructor() {
    super("Idempotency key already used for a different registration or request.");
    this.name = "IdempotencyConflictError";
  }
}
