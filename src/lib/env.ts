/**
 * Server-only environment accessors. Every function throws a clear, specific
 * error when a required variable is missing — but none of them read
 * `process.env` at module load, only when called. Importing this file (even
 * transitively, e.g. during static generation) never throws and never
 * touches MongoDB by itself; only calling `getMongoEnv()` does.
 */

interface MongoEnv {
  uri: string;
  dbName: string;
}

export function getMongoEnv(): MongoEnv {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env and fill in a connection string.",
    );
  }
  if (!dbName) {
    throw new Error(
      "MONGODB_DB is not set. Copy .env.example to .env and fill in a database name.",
    );
  }

  return { uri, dbName };
}

/** The literal string "true" — anything else (including unset) means disabled. */
export function isRegistrationEnabled(): boolean {
  return process.env.MASTERCLASS_REGISTRATION_ENABLED === "true";
}
