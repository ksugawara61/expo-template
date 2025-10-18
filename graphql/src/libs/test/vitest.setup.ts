import { execSync } from "node:child_process";
import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll } from "vitest";
import { db } from "../drizzle/client";
import { mockServer } from "./mockServer";

const clearAllTables = async () => {
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
  // Set up unique database for this worker to avoid locking issues
  const timestamp = Date.now();
  const pid = process.pid;
  const workerId = process.env.VITEST_WORKER_ID || "main";
  const random = Math.random().toString(36).substring(2);
  process.env.TURSO_DATABASE_URL = `file:./test-${timestamp}-${pid}-${workerId}-${random}.db`;
  process.env.TURSO_AUTH_TOKEN = "";

  console.log(
    `Setting up database for worker ${workerId}: ${process.env.TURSO_DATABASE_URL}`,
  );

  // Initialize database schema for this worker
  try {
    execSync("pnpm db:generate", { stdio: "pipe" });
    execSync("pnpm db:push", { stdio: "pipe" });
  } catch (error) {
    console.warn("Database setup warning:", error);
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
