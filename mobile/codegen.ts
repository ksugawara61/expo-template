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
    "src/libs/graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' }
      },
      plugins: ["typescript-msw"],
    },
  },
  hooks: {
    afterAllFileWrite: ["biome check --write src/libs/graphql/schema.graphql"],
  }
};

export default config;
