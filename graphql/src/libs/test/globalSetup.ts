import { execSync } from "node:child_process";

const setUp = () => {
  // Use a temporary file database for tests
  const timestamp = Date.now();
  process.env.TURSO_DATABASE_URL = `file:./test-${timestamp}.db`;
  process.env.TURSO_AUTH_TOKEN = "";
  console.log("Database migration starting...");
  execSync("pnpm db:generate", { stdio: "inherit" });
  execSync("pnpm db:push", { stdio: "inherit" });
  console.log("Database migration completed.");
};

export default setUp;
