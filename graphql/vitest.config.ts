import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./src/libs/test/vitest.setup.ts",
    silent: false,
    watch: false,
    env: {
      DATABASE_URL: "postgresql://test_user:test_password@localhost:5433/test_db?schema=public",
    },
  },
});
