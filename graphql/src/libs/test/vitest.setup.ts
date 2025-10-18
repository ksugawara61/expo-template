import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll } from "vitest";
import { getTestDb } from "../drizzle/testClient";
import { mockServer } from "./mockServer";

const clearAllTables = async () => {
  const db = getTestDb();
  // Clear tables with foreign key constraints disabled
  try {
    await db.run(sql`PRAGMA foreign_keys = OFF`);
    await db.run(sql`DELETE FROM bookmark_tags`);
    await db.run(sql`DELETE FROM bookmarks`);
    await db.run(sql`DELETE FROM tags`);
    await db.run(sql`PRAGMA foreign_keys = ON`);
  } catch (error) {
    console.warn("Table clearing warning:", error);
    // Make sure foreign keys are re-enabled even if clearing fails
    try {
      await db.run(sql`PRAGMA foreign_keys = ON`);
    } catch {
      // Ignore
    }
  }
};

beforeAll(async () => {
  mockServer.listen();
});

afterEach(async () => {
  mockServer.resetHandlers();
  await clearAllTables();
});

afterAll(async () => {
  mockServer.close();
});
