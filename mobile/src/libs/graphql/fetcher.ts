import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

const GRAPHQL_ENDPOINT = "http://127.0.0.1:3000/graphql";

/**
 * GraphQL リクエストのオプション
 */
export type GraphQLFetcherOptions = {
  /** タイムアウト時間（ミリ秒）。デフォルトは30秒 */
  timeout?: number;
  /** リトライ回数。デフォルトは3回 */
  maxRetries?: number;
  /** リトライの初期待機時間（ミリ秒）。デフォルトは1000ms */
  retryDelay?: number;
};

/**
 * タイムアウト付きfetchを実行する
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 指定時間待機する
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GraphQL クエリを実行する fetcher 関数
 * Apollo Clientに近い機能として、タイムアウトとリトライ機能を提供します
 */
export async function graphqlFetcher<TResult, TVariables>(
  query: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options: GraphQLFetcherOptions = {},
): Promise<TResult> {
  const { timeout = 30000, maxRetries = 3, retryDelay = 1000 } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(
        GRAPHQL_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/graphql-response+json",
          },
          body: JSON.stringify({
            query: print(query),
            variables,
          }),
        },
        timeout,
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const json = await response.json();

      if (json.errors) {
        throw new Error(json.errors[0]?.message || "GraphQL Error");
      }

      return json.data as TResult;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // 最後の試行でなければリトライ
      if (attempt < maxRetries - 1) {
        // 指数バックオフでリトライ間隔を増やす
        const waitTime = retryDelay * 2 ** attempt;
        await sleep(waitTime);
      }
    }
  }

  throw lastError || new Error("GraphQL request failed");
}

/**
 * GraphQL ミューテーションを実行する関数
 */
export async function graphqlMutate<TResult, TVariables>(
  mutation: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
  options?: GraphQLFetcherOptions,
): Promise<TResult> {
  return graphqlFetcher(mutation, variables, options);
}
