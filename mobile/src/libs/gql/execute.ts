import { graphqlFetcher } from "@/libs/graphql/fetcher";
import type { TypedDocumentString } from "./graphql";

/**
 * GraphQL operations executor for TanStack Query
 * Provides a simple function to execute GraphQL operations
 */
export function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  return graphqlFetcher(query.toString(), variables);
}