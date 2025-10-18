import { execSync } from "node:child_process";

const setUp = () => {
  // Use a unique database file for each test run to avoid locking issues
  // Include process PID and random string for uniqueness across workers/threads
  const timestamp = Date.now();
  const pid = process.pid;
  const random = Math.random().toString(36).substring(2);
  process.env.TURSO_DATABASE_URL = `file:./test-${timestamp}-${pid}-${random}.db`;
  process.env.TURSO_AUTH_TOKEN = "";
  console.log("Database migration starting...");
  execSync("pnpm db:generate", { stdio: "inherit" });
  execSync("pnpm db:push", { stdio: "inherit" });
  console.log("Database migration completed.");
};

export default setUp;
