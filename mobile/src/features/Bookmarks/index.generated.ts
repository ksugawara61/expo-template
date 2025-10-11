import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import type * as Types from "@/libs/gql/graphql";
import { graphqlFetcher } from "@/libs/graphql/fetcher";
export type BookmarkFragment = {
  __typename?: "Bookmark";
  created_at: string;
  description?: string | null;
  id: string;
  title: string;
  updated_at: string;
  url: string;
};

export type GetBookmarksQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetBookmarksQuery = {
  __typename?: "Query";
  bookmarks: Array<{
    __typename?: "Bookmark";
    created_at: string;
    description?: string | null;
    id: string;
    title: string;
    updated_at: string;
    url: string;
  }>;
};

export type DeleteBookmarkMutationVariables = Types.Exact<{
  id: Types.Scalars["String"]["input"];
}>;

export type DeleteBookmarkMutation = {
  __typename?: "Mutation";
  deleteBookmark: boolean;
};

export const BookmarkFragmentDoc = `
    fragment Bookmark on Bookmark {
  created_at
  description
  id
  title
  updated_at
  url
}
    `;

export const GetBookmarksDocument = `
    query GetBookmarks {
  bookmarks {
    ...Bookmark
  }
}
    ${BookmarkFragmentDoc}`;

export const useGetBookmarksQuery = <
  TData = GetBookmarksQuery,
  TError = unknown,
>(
  variables?: GetBookmarksQueryVariables,
  options?: UseQueryOptions<GetBookmarksQuery, TError, TData>,
) => {
  return useQuery<GetBookmarksQuery, TError, TData>({
    queryKey:
      variables === undefined ? ["GetBookmarks"] : ["GetBookmarks", variables],
    queryFn: () =>
      graphqlFetcher<GetBookmarksQuery, GetBookmarksQueryVariables>(
        GetBookmarksDocument,
        variables,
      ),
    ...options,
  });
};

useGetBookmarksQuery.getKey = (variables?: GetBookmarksQueryVariables) =>
  variables === undefined ? ["GetBookmarks"] : ["GetBookmarks", variables];

useGetBookmarksQuery.fetcher = (
  variables?: GetBookmarksQueryVariables,
  options?: RequestInit["headers"],
) =>
  graphqlFetcher<GetBookmarksQuery, GetBookmarksQueryVariables>(
    GetBookmarksDocument,
    variables,
    options,
  );

export const DeleteBookmarkDocument = `
    mutation DeleteBookmark($id: String!) {
  deleteBookmark(id: $id)
}
    `;

export const useDeleteBookmarkMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteBookmarkMutation,
    TError,
    DeleteBookmarkMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    DeleteBookmarkMutation,
    TError,
    DeleteBookmarkMutationVariables,
    TContext
  >({
    mutationFn: (variables: DeleteBookmarkMutationVariables) =>
      graphqlFetcher<DeleteBookmarkMutation, DeleteBookmarkMutationVariables>(
        DeleteBookmarkDocument,
        variables,
      ),
    ...options,
  });
};

useDeleteBookmarkMutation.fetcher = (
  variables: DeleteBookmarkMutationVariables,
  options?: RequestInit["headers"],
) =>
  graphqlFetcher<DeleteBookmarkMutation, DeleteBookmarkMutationVariables>(
    DeleteBookmarkDocument,
    variables,
    options,
  );
