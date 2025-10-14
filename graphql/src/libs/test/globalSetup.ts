import { execSync } from "node:child_process";

const setUp = () => {
  process.env.DATABASE_URL = "file:./test.db";
  process.env.TURSO_DATABASE_URL = "";
  console.log("Database migration starting...");
  execSync("pnpm db:generate", { stdio: "inherit" });
  execSync("pnpm db:migrate", { stdio: "inherit" });
  console.log("Database migration completed.");
};

export default setUp;
