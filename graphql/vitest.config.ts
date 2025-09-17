import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./src/libs/test/vitest.setup.ts",
    silent: false,
    watch: false,
    env: {
      DATABASE_URL: "file:./test.db",
    },
  },
});
