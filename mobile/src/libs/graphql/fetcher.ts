import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

const GRAPHQL_ENDPOINT = "http://127.0.0.1:3000/graphql";

/**
 * GraphQL クエリを実行する fetcher 関数
 * TanStack QueryとSWRの両方で使用可能
 */
export async function graphqlFetcher<TResult, TVariables>(
  query: TypedDocumentNode<TResult, TVariables> | string,
  variables?: TVariables,
  headers?: RequestInit["headers"],
): Promise<TResult> {
  const controller = new AbortController();

  // 30秒でタイムアウト
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/graphql-response+json",
        ...headers,
      },
      body: JSON.stringify({
        query: typeof query === "string" ? query : print(query),
        variables,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0]?.message || "GraphQL Error");
    }

    return json.data as TResult;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * GraphQL ミューテーションを実行する関数
 */
export async function graphqlMutate<TResult, TVariables>(
  mutation: TypedDocumentNode<TResult, TVariables> | string,
  variables: TVariables,
): Promise<TResult> {
  return graphqlFetcher(mutation, variables);
}
