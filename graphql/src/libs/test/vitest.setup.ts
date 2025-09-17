import { execSync } from "node:child_process";
import { afterAll, afterEach, beforeAll } from "vitest";
import { mockServer } from "./mockServer";

beforeAll(async () => {
  // Generate unique database for each test run to avoid locking issues
  const testDbName = `test-${Date.now()}-${Math.random().toString(36).substring(7)}.db`;
  process.env.DATABASE_URL = `file:./${testDbName}`;

  // Run database migration for test environment
  execSync("pnpm db:migrate", { stdio: "inherit" });
  mockServer.listen();
});

afterEach(async () => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});
