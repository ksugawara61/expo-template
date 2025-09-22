import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export const baseRules = {
  // TypeScript
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/await-thenable": "error",
};

export const jsRules = {
  "no-unused-vars": [
    "error",
    {
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],
};

export const baseIgnores = [
  "**/__templates/**",
  "**/.drizzle/**",
  "**/node_modules/**",
  "**/coverage/**",
  "**/build/**",
  "**/dist/**",
  "**/*.config.{ts,js}",
  "**/preprocessing.js",
];

export const baseTypeScriptConfig = {
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: tsParser,
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
  },
  rules: {
    ...baseRules,
  },
};

export const baseJavaScriptConfig = {
  files: ["**/*.{js,jsx}"],
  languageOptions: {
    sourceType: "module",
  },
  rules: {
    ...jsRules,
  },
};
