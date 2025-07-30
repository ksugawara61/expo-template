import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "graphql/.pylon/schema.graphql",
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  overwrite: true,
  config: {
    scalars: {
      UUID: "string",
      Time: "string",
      Date: "string",
      Cursor: "string",
      Datetime: "string",
      BigFloat: "number",
      BigInt: "number",
      JSON: "unknown",
      Opaque: "unknown",
    },
  },
  generates: {
    "src/libs/gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' }
      }
    },
    "src/": {
      preset: "near-operation-file",
      presetConfig: {
        extension: ".msw.ts",
        baseTypesPath: "~@/libs/gql/graphql",
        importTypesNamespace: "Types",
      },
      plugins: ["typescript-operations", "typescript-msw"],
    },
  },
};

export default config;
