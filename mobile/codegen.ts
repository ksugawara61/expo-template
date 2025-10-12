import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/libs/graphql/schema.graphql",
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
        extension: ".generated.ts",
        baseTypesPath: "~@/libs/gql/graphql",
        importTypesNamespace: "Types",
      },
      plugins: ["typescript-operations", "typescript-msw"],
    },
  },
  hooks: {
    afterAllFileWrite: ["biome check --write src/libs/graphql/schema.graphql"],
  }
};

export default config;
