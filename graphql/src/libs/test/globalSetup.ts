import { execSync } from "node:child_process";

const setUp = () => {
  // Skip database setup if environment variable is set
  if (process.env.SKIP_DB_SETUP === "true") {
    console.log("Skipping database setup...");
    return;
  }

  process.env.DATABASE_URL = "file:./test.db";
  console.log("Database migration starting...");
  execSync("pnpm db:generate", { stdio: "inherit" });
  execSync("pnpm db:migrate", { stdio: "inherit" });
  console.log("Database migration completed.");
};

export default setUp;
