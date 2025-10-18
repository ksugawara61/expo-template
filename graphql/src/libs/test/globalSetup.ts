import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../drizzle/schema";

const setUp = async () => {
  // Set up a single test database for all tests
  const testDbFile = "./test-database.db";
  process.env.TURSO_DATABASE_URL = `file:${testDbFile}`;
  process.env.TURSO_AUTH_TOKEN = "";

  console.log("Setting up test database...");

  // Create database client
  const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(tursoClient, { schema });

  try {
    // Enable WAL mode for better concurrency
    await db.run(sql`PRAGMA journal_mode = WAL`);
    await db.run(sql`PRAGMA synchronous = NORMAL`);
    await db.run(sql`PRAGMA busy_timeout = 30000`);

    // Create tables using SQL to match the Drizzle schema
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

    console.log("Test database setup completed.");
  } catch (error) {
    console.error("Database setup error:", error);
    throw error;
  }
};

export default setUp;
