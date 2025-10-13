import { initGraphQLTada } from "gql.tada";
import type { introspection } from "./graphql-env.d.ts";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    UUID: string;
    Time: string;
    Date: string;
    Cursor: string;
    Datetime: string;
    BigFloat: number;
    BigInt: number;
    JSON: unknown;
    Opaque: unknown;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
