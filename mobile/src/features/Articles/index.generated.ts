import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type * as Types from "@/libs/gql/graphql";
import { graphqlFetcher } from "@/libs/graphql/fetcher";
export type GetArticlesQueryVariables = Types.Exact<{
  page: Types.Scalars["Number"]["input"];
}>;

export type GetArticlesQuery = {
  __typename?: "Query";
  articles: Array<{
    __typename?: "Article";
    created_at: string;
    id: string;
    title: string;
    tags: Array<{ __typename?: "Tag"; name: string }>;
    user: { __typename?: "User"; name?: string | null };
  }>;
};

export const GetArticlesDocument = `
    query GetArticles($page: Number!) {
  articles(page: $page) {
    created_at
    id
    tags {
      name
    }
    title
    user {
      name
    }
  }
}
    `;

export const useGetArticlesQuery = <TData = GetArticlesQuery, TError = unknown>(
  variables: GetArticlesQueryVariables,
  options?: UseQueryOptions<GetArticlesQuery, TError, TData>,
) => {
  return useQuery<GetArticlesQuery, TError, TData>({
    queryKey: ["GetArticles", variables],
    queryFn: () =>
      graphqlFetcher<GetArticlesQuery, GetArticlesQueryVariables>(
        GetArticlesDocument,
        variables,
      ),
    ...options,
  });
};

useGetArticlesQuery.getKey = (variables: GetArticlesQueryVariables) => [
  "GetArticles",
  variables,
];

useGetArticlesQuery.fetcher = (
  variables: GetArticlesQueryVariables,
  options?: RequestInit["headers"],
) =>
  graphqlFetcher<GetArticlesQuery, GetArticlesQueryVariables>(
    GetArticlesDocument,
    variables,
    options,
  );
