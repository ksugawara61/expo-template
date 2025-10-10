import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

const GRAPHQL_ENDPOINT = "http://127.0.0.1:3000/graphql";

/**
 * GraphQL クエリを実行する fetcher 関数
 */
export async function graphqlFetcher<TResult, TVariables>(
  query: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
    },
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL Error");
  }

  return json.data as TResult;
}

/**
 * GraphQL ミューテーションを実行する関数
 */
export async function graphqlMutate<TResult, TVariables>(
  mutation: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
): Promise<TResult> {
  return graphqlFetcher(mutation, variables);
}
