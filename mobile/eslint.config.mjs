import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jestPlugin from "eslint-plugin-jest";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";
import testingLibraryPlugin from "eslint-plugin-testing-library";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commonRules = {
  // React Native固有のルール
  "react-native/no-unused-styles": "error",
  "react-native/split-platform-components": "error",
  "react-native/no-inline-styles": "off",
  "react-native/no-raw-text": [
    "error",
    {
      skip: ["CardTitle", "CardDescription", "Button"],
    },
  ],
  "react-native/no-single-element-style-arrays": "error",

  // Reactのルール
  "react/prop-types": "off",
  "react/react-in-jsx-scope": "off",
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "error",
};

const typeAwareRules = {
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

const javaScriptRules = {
  "no-unused-vars": [
    "error",
    {
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],
};

const ignores = [
  "**/__templates/**",
  "**/.drizzle/**",
  "**/node_modules/**",
  "**/coverage/**",
  "**/android/**",
  "**/ios/**",
  "**/.storybook/**",
  "**/vrt/**",
  "**/.expo/**",
  "**/build/**",
  "**/*.config.{ts,js}",
  "**/preprocessing.js",
  "**/storybook-static/**",
];

export default [
  // TypeScript用の設定
  {
    files: ["**/*.{ts,tsx}"],
    ignores,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-native": reactNativePlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...commonRules,
      ...typeAwareRules,
    },
  },

  // カスタムインポートルール
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [...ignores, "**/src/libs/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@testing-library/react-native",
              message:
                "Please use @/libs/test/testing-library instead of @testing-library/react-native.",
            },
            {
              name: "@/libs/test/testing-library",
              importNames: ["fireEvent"],
              message: "Please use userEvent instead of fireEvent",
            },
            {
              name: "swr",
              message: "Please use @/libs/swr instead of swr.",
            },
          ],
        },
      ],
    },
  },

  // テストファイル用の設定
  {
    files: ["**/*.{test,spec}.{ts,tsx}"],
    ignores,
    plugins: {
      jest: jestPlugin,
      "testing-library": testingLibraryPlugin,
    },
    rules: {
      ...typeAwareRules,
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/valid-expect": "error",
      "testing-library/await-async-queries": "error",
      "testing-library/no-await-sync-queries": "error",
      "testing-library/prefer-screen-queries": "error",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },

  // JavaScript用の設定
  {
    files: ["**/*.{js,jsx}"],
    ignores,
    languageOptions: {
      sourceType: "module",
    },
    plugins: {
      react: reactPlugin,
      "react-native": reactNativePlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...commonRules,
      ...javaScriptRules,
    },
  },

  // TypeScript内のGraphQL operations用の設定
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [...ignores, "**/src/libs/gql/**"],
    processor: graphqlPlugin.processor,
  },

  // GraphQL用の設定
  {
    files: ["**/*.graphql"],
    ignores,
    languageOptions: {
      parser: graphqlPlugin.parser,
    },
    plugins: {
      "@graphql-eslint": graphqlPlugin,
    },
    rules: {
      // 基本的なルールのみ追加（スキーマが不要なもの）
    },
  },
];
