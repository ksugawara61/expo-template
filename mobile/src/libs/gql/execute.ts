import { graphqlFetcher } from "@/libs/graphql/fetcher";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

/**
 * GraphQL operations executor for TanStack Query
 * Provides a simple function to execute GraphQL operations
 */
export function execute<TResult, TVariables>(
  query: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  return graphqlFetcher(query, variables);
}