import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import jestPlugin from "eslint-plugin-jest";
import preferArrowFunctionsPlugin from "eslint-plugin-prefer-arrow-functions";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import {
  baseIgnores,
  baseJavaScriptConfig,
  baseRules,
  baseTypeScriptConfig,
  jsRules,
} from "./index.js";

const mobileSpecificRules = {
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

const mobileIgnores = [
  ...baseIgnores,
  "**/android/**",
  "**/ios/**",
  "**/.storybook/**",
  "**/vrt/**",
  "**/.expo/**",
  "**/storybook-static/**",
  "**/public/mockServiceWorker.js",
];

export default function createMobileConfig(projectRoot = process.cwd()) {
  return [
    // TypeScript用の設定
    {
      ...baseTypeScriptConfig,
      ignores: mobileIgnores,
      languageOptions: {
        ...baseTypeScriptConfig.languageOptions,
        parserOptions: {
          project: "./tsconfig.json",
          tsconfigRootDir: projectRoot,
        },
      },
      plugins: {
        ...baseTypeScriptConfig.plugins,
        react: reactPlugin,
        "react-native": reactNativePlugin,
        "react-hooks": reactHooksPlugin,
        "prefer-arrow-functions": preferArrowFunctionsPlugin,
      },
      settings: {
        react: { version: "detect" },
      },
      rules: {
        ...baseRules,
        ...mobileSpecificRules,
      },
    },

    // カスタムインポートルール
    {
      files: ["**/*.{ts,tsx}"],
      ignores: [...mobileIgnores, "**/src/libs/**/*.{ts,tsx}"],
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
                name: "urql",
                message: "Please use @/libs/graphql/urql instead of urql.",
              },
              {
                name: "gql.tada",
                message:
                  "Please use @/libs/graphql/gql-tada instead of gql.tada.",
              },
            ],
          },
        ],
      },
    },

    // テストファイル用の設定
    {
      files: ["**/*.{test,spec}.{ts,tsx}"],
      ignores: mobileIgnores,
      plugins: {
        jest: jestPlugin,
        "testing-library": testingLibraryPlugin,
      },
      rules: {
        ...baseRules,
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
      ...baseJavaScriptConfig,
      ignores: mobileIgnores,
      plugins: {
        ...baseJavaScriptConfig.plugins,
        react: reactPlugin,
        "react-native": reactNativePlugin,
        "react-hooks": reactHooksPlugin,
        "prefer-arrow-functions": preferArrowFunctionsPlugin,
      },
      settings: {
        react: { version: "detect" },
      },
      rules: {
        ...jsRules,
        ...mobileSpecificRules,
      },
    },

    // TypeScript内のGraphQL operations用の設定
    {
      files: ["**/*.{ts,tsx}"],
      ignores: [...mobileIgnores, "**/src/libs/gql/**"],
      processor: graphqlPlugin.processor,
    },

    // GraphQL用の設定
    {
      files: ["**/*.graphql"],
      ignores: mobileIgnores,
      languageOptions: {
        parser: graphqlPlugin.parser,
        parserOptions: {
          graphQLConfig: {
            schema: "./src/libs/graphql/schema.graphql",
          },
        },
      },
      plugins: {
        "@graphql-eslint": graphqlPlugin,
      },
      rules: {
        "@graphql-eslint/alphabetize": [
          "error",
          { selections: ["OperationDefinition", "FragmentDefinition"] },
        ],
        "@graphql-eslint/no-anonymous-operations": "error",
        "@graphql-eslint/naming-convention": [
          "error",
          {
            OperationDefinition: {
              style: "PascalCase",
              forbiddenPrefixes: ["Query", "Mutation", "Subscription"],
              forbiddenSuffixes: ["Query", "Mutation", "Subscription"],
            },
          },
        ],
      },
    },
  ];
}
