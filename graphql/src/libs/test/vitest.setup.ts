import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll } from "vitest";
import { db } from "../drizzle/client";
import { mockServer } from "./mockServer";

const clearAllTables = async () => {
  const tables = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type='table'`,
  );

  const tableNames = tables
    .filter((table) => table.name !== "__drizzle_migrations")
    .map((table) => table.name);

  for (const tableName of tableNames) {
    try {
      await db.run(sql.raw(`DELETE FROM ${tableName}`));
    } catch {
      // Ignore if table doesn't exist or other errors
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
