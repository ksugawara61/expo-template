import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

let testDb: ReturnType<typeof drizzle> | null = null;

export const getTestDb = () => {
  if (!testDb) {
    const tursoClient = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:./local.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    testDb = drizzle(tursoClient, { schema });
  }
  return testDb;
};

export const resetTestDb = () => {
  testDb = null;
};
