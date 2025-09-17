import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./src/libs/test/vitest.setup.ts",
    globalSetup: "./src/libs/test/globalSetup.ts",
    silent: false,
    watch: false,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
