import tsParser from "@typescript-eslint/parser";
import jestPlugin from "eslint-plugin-jest";
import { baseRules, jsRules, baseIgnores, baseTypeScriptConfig, baseJavaScriptConfig } from "./index.js";

const graphqlIgnores = [
  ...baseIgnores,
  "**/.pylon/**",
  "**/prisma/migrations/**",
  "**/src/generated/**",
];

export default function createGraphQLConfig(projectRoot = process.cwd()) {
  return [
    // TypeScript用の設定
    {
      ...baseTypeScriptConfig,
      ignores: graphqlIgnores,
      languageOptions: {
        ...baseTypeScriptConfig.languageOptions,
        parserOptions: {
          project: "./tsconfig.json",
          tsconfigRootDir: projectRoot,
        },
      },
      rules: {
        ...baseRules,
      },
    },

    // テストファイル用の設定
    {
      files: ["**/*.{test,spec}.{ts,tsx}"],
      ignores: graphqlIgnores,
      plugins: {
        jest: jestPlugin,
      },
      rules: {
        ...baseRules,
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/valid-expect": "error",
        "@typescript-eslint/no-floating-promises": "error",
      },
    },

    // JavaScript用の設定
    {
      ...baseJavaScriptConfig,
      ignores: graphqlIgnores,
      rules: {
        ...jsRules,
      },
    },
  ];
}