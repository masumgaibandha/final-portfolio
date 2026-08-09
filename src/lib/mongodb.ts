import { MongoClient, type Db } from "mongodb";

import { getMongoEnv } from "@/lib/env";

/*
 * Node.js runtime only — the `mongodb` driver uses APIs Edge doesn't provide.
 * Every caller (the registrations API route today) must declare
 * `export const runtime = "nodejs"`.
 *
 * Never imported by a page or layout, so it never runs during static
 * generation. `getDb()` is the only entry point, and it does nothing until
 * awaited — importing this module never opens a connection or reads env vars.
 */

declare global {
  var _masterclassMongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

function createClientPromise(): Promise<MongoClient> {
  const { uri } = getMongoEnv();
  return new MongoClient(uri).connect();
}

/*
 * In development, Next.js's module reloading (HMR) would otherwise re-run
 * this module on every edit and open a fresh connection each time. Caching
 * the promise on `globalThis` — which survives module reloads — keeps one
 * connection per dev server process instead. Production doesn't reload
 * modules, so a plain module-scope variable is enough there.
 */
function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!globalThis._masterclassMongoClientPromise) {
      globalThis._masterclassMongoClientPromise = createClientPromise();
    }
    return globalThis._masterclassMongoClientPromise;
  }

  clientPromise ??= createClientPromise();
  return clientPromise;
}

/** Exposed alongside `getDb()` so callers can start a session for a multi-document transaction. */
export async function getClient(): Promise<MongoClient> {
  return getClientPromise();
}

export async function getDb(): Promise<Db> {
  const { dbName } = getMongoEnv();
  const client = await getClientPromise();
  return client.db(dbName);
}
