import { createHmac } from "node:crypto";
import type { Collection } from "mongodb";

import { getDb } from "@/lib/mongodb";

export const RATE_LIMIT_COLLECTION = "masterclass_rate_limits";

/** Documents stay around this much longer than their window before TTL deletion — a debugging/safety margin, not part of the limit logic. */
const SAFETY_BUFFER_MS = 5 * 60 * 1000;

export type RateLimitScope = "ip" | "email";

/**
 * IP: 30 attempts / 10 minutes. Kept generous rather than tight — Bangladeshi
 * mobile/carrier NAT can place many unrelated, legitimate students behind
 * one shared public IP, and a low threshold would lock all of them out
 * together.
 *
 * Email: 5 attempts / 60 minutes — a much tighter, identity-scoped limit,
 * since a real student has no legitimate reason to submit the same email
 * many times in an hour.
 */
export const RATE_LIMIT_RULES: Record<RateLimitScope, { limit: number; windowMs: number }> = {
  ip: { limit: 30, windowMs: 10 * 60 * 1000 },
  email: { limit: 5, windowMs: 60 * 60 * 1000 },
};

/**
 * Only a keyed HMAC digest of the subject is ever stored — never the raw IP
 * or email. `scope`/`windowStart`/`count` reveal nothing about who made the
 * request, and `subjectHash` cannot be reversed without `secret`
 * (`MASTERCLASS_RATE_LIMIT_SECRET`, never logged, never client-exposed).
 */
interface RateLimitDocument {
  scope: RateLimitScope;
  subjectHash: string;
  windowStart: Date;
  count: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

let indexesEnsured: Promise<void> | undefined;

async function ensureIndexes(collection: Collection<RateLimitDocument>): Promise<void> {
  indexesEnsured ??= (async () => {
    await Promise.all([
      collection.createIndex(
        { scope: 1, subjectHash: 1, windowStart: 1 },
        { unique: true, name: "uniq_scope_subject_window" },
      ),
      collection.createIndex(
        { expiresAt: 1 },
        { name: "ttl_expires_at", expireAfterSeconds: 0 },
      ),
    ]);
  })();
  return indexesEnsured;
}

async function getCollection(): Promise<Collection<RateLimitDocument>> {
  const db = await getDb();
  const collection = db.collection<RateLimitDocument>(RATE_LIMIT_COLLECTION);
  await ensureIndexes(collection);
  return collection;
}

function hashSubject(scope: RateLimitScope, subject: string, secret: string): string {
  return createHmac("sha256", secret).update(`${scope}:${subject}`).digest("hex");
}

/** Rounds `now` down to the start of its fixed window. */
function windowStartFor(now: Date, windowMs: number): Date {
  return new Date(now.getTime() - (now.getTime() % windowMs));
}

export interface CheckRateLimitInput {
  scope: RateLimitScope;
  /** Raw IP or normalized email — hashed inside this function, never persisted as-is. */
  subject: string;
  secret: string;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/**
 * Atomic fixed-window counter via one upserting `findOneAndUpdate` per call.
 * Concurrent requests for the same `(scope, subjectHash, windowStart)`
 * serialize through the unique index and the atomic `$inc` — none of them
 * can read a stale count and slip past the limit, unlike a
 * read-then-write/in-memory counter would allow under concurrency.
 */
export async function checkRateLimit(input: CheckRateLimitInput): Promise<RateLimitResult> {
  const { limit, windowMs } = RATE_LIMIT_RULES[input.scope];
  const collection = await getCollection();
  const now = new Date();
  const windowStart = windowStartFor(now, windowMs);
  const subjectHash = hashSubject(input.scope, input.subject, input.secret);
  const expiresAt = new Date(windowStart.getTime() + windowMs + SAFETY_BUFFER_MS);

  const updated = await collection.findOneAndUpdate(
    { scope: input.scope, subjectHash, windowStart },
    {
      $inc: { count: 1 },
      $setOnInsert: { createdAt: now, expiresAt },
      $set: { updatedAt: now },
    },
    { upsert: true, returnDocument: "after" },
  );

  const count = updated?.count ?? 1;
  const windowEndMs = windowStart.getTime() + windowMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((windowEndMs - now.getTime()) / 1000));

  return { allowed: count <= limit, retryAfterSeconds };
}
