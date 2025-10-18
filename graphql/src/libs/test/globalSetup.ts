import { execSync } from "node:child_process";

const testDbFile = "./test-database.db";

export const setup = async () => {
  // Set up a single test database for all tests
  process.env.TURSO_DATABASE_URL = `file:${testDbFile}`;
  process.env.TURSO_AUTH_TOKEN = "";

  console.log("Setting up test database...");
  execSync("pnpm db:generate", { stdio: "inherit" });
  execSync("pnpm db:migrate", { stdio: "inherit" });
  console.log("Test database setup completed.");
};

export const teardown = async () => {
  // Clean up the test database
  if (process.env.TURSO_DATABASE_URL?.startsWith("file:./test-database.db")) {
    execSync("rm ./test-database.db");
  }
};
