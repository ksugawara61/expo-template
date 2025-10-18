import { execSync } from "node:child_process";
import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll } from "vitest";
import { getTestDb, resetTestDb } from "../drizzle/testClient";
import { mockServer } from "./mockServer";

const clearAllTables = async () => {
  const db = getTestDb();
  // Get all table names from the database
  const tables = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type='table'`,
  );

  const tableNames = tables
    .filter((table) => table.name !== "__drizzle_migrations")
    .map((table) => table.name);

  // Clear tables in reverse order to avoid foreign key constraint issues
  // We know the dependency order: bookmark_tags -> bookmarks, tags
  const orderedTables = ["bookmark_tags", "bookmarks", "tags"].filter((name) =>
    tableNames.includes(name),
  );

  for (const tableName of orderedTables) {
    try {
      await db.run(sql.raw(`DELETE FROM ${tableName}`));
    } catch {
      // Ignore if table doesn't exist or other errors
    }
  }
};

beforeAll(async () => {
  // Set up in-memory database for tests
  process.env.TURSO_DATABASE_URL = ":memory:";
  process.env.TURSO_AUTH_TOKEN = "";

  console.log("Setting up in-memory database for tests");

  // Reset the test database client to use the new environment variables
  resetTestDb();

  // Create tables manually (since drizzle commands are problematic in tests)
  const db = getTestDb();
  try {
    // Create tables using SQL
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT (datetime('now')) NOT NULL,
        updated_at TEXT DEFAULT (datetime('now')) NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        created_at TEXT DEFAULT (datetime('now')) NOT NULL,
        updated_at TEXT DEFAULT (datetime('now')) NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS bookmark_tags (
        bookmark_id TEXT NOT NULL,
        tag_id TEXT NOT NULL,
        PRIMARY KEY (bookmark_id, tag_id),
        FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      )
    `);
  } catch (error) {
    console.warn("Database table creation warning:", error);
  }

  mockServer.listen();
});

afterEach(async () => {
  mockServer.resetHandlers();
  await clearAllTables();
});

afterAll(async () => {
  mockServer.close();
});
