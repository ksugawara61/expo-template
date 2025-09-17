import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./src/libs/test/vitest.setup.ts",
    silent: false,
    watch: false,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    env: {
      DATABASE_URL: "file:./test.db",
    },
  },
});
