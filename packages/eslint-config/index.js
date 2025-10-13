import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import preferArrowFunctionsPlugin from "eslint-plugin-prefer-arrow-functions";

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

  // Arrow functions
  "func-style": ["error", "expression", { allowArrowFunctions: true }],
  "prefer-arrow-functions/prefer-arrow-functions": [
    "error",
    {
      allowNamedFunctions: false,
      classPropertiesAllowed: false,
      disallowPrototype: false,
      returnStyle: "unchanged",
      singleReturnOnly: false,
    },
  ],

  // Function definition order
  "@typescript-eslint/no-use-before-define": [
    "error",
    {
      functions: false,
      classes: true,
      variables: true,
    },
  ],
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

  // Arrow functions
  "func-style": ["error", "expression", { allowArrowFunctions: true }],
  "prefer-arrow-functions/prefer-arrow-functions": [
    "error",
    {
      allowNamedFunctions: false,
      classPropertiesAllowed: false,
      disallowPrototype: false,
      returnStyle: "unchanged",
      singleReturnOnly: false,
    },
  ],

  // Function definition order
  "no-use-before-define": [
    "error",
    {
      functions: false,
      classes: true,
      variables: true,
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
    "prefer-arrow-functions": preferArrowFunctionsPlugin,
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
  plugins: {
    "prefer-arrow-functions": preferArrowFunctionsPlugin,
  },
  rules: {
    ...jsRules,
  },
};
