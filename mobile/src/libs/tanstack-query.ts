import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  type UseSuspenseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { graphqlFetcher } from "@/libs/graphql/fetcher";

export * from "@tanstack/react-query";

/**
 * useSuspenseQuery を使用した GraphQL クエリ用カスタムフック
 * SWR の useSWRSuspense と同様の動作を提供
 */
export const useTanStackQuerySuspense = <TResult, TVariables>(
  key: string,
  query: TypedDocumentNode<TResult, TVariables> | string,
  variables?: TVariables,
  options?: Omit<
    UseSuspenseQueryOptions<TResult, Error, TResult, readonly unknown[]>,
    "queryKey" | "queryFn"
  >,
) => {
  const queryKey = variables ? [key, variables] : [key];
  const res = useSuspenseQuery({
    queryKey,
    queryFn: () => graphqlFetcher<TResult, TVariables>(query, variables),
    ...options,
  });

  return { ...res, data: res.data };
};
