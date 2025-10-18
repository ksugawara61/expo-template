import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(tursoClient, { schema });

// Export a function to get the current database instance
// This allows for dynamic database switching in tests
export const getDb = () => {
  // In test environment, we may want to use a different database
  if (process.env.NODE_ENV === "test" && typeof process !== "undefined") {
    // Dynamic import to avoid circular dependency issues
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getTestDb } = require("./testClient");
      return getTestDb();
    } catch {
      // Fall back to regular db if testClient is not available
      return db;
    }
  }
  return db;
};
