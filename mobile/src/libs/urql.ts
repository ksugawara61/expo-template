import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useQuery as useUrqlQuery } from "urql";

export * from "urql";

/**
 * urql の suspense モードを使うためのカスタムフック
 * 公式の suspense モードでは data の型が undefined になってしまうが、
 * 想定していない挙動のため、型を保証するためにこのカスタムフックを作成
 * GraphQLクエリから型を自動推論する
 */
export const useQuery = <
  TResult,
  TVariables extends Record<string, unknown>,
>(args: {
  query: TypedDocumentNode<TResult, TVariables>;
  variables: TVariables;
  requestPolicy?:
    | "cache-first"
    | "cache-only"
    | "network-only"
    | "cache-and-network";
  pause?: boolean;
  context?: Record<string, unknown>;
}) => {
  const [result, executeQuery] = useUrqlQuery<TResult, TVariables>(args);

  // suspense モードが有効な場合、エラーまたはデータ未取得時にエラーをスロー
  if (result.error) {
    throw result.error;
  }

  if (typeof result.data === "undefined") {
    // suspense モードではここに来ることはない想定
    throw new Error("data is undefined");
  }

  return [{ ...result, data: result.data }, executeQuery] as const;
};
