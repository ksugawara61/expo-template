import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type * as Types from "@/libs/gql/graphql";
import { graphqlFetcher } from "@/libs/graphql/fetcher";
export type CreateBookmarkMutationVariables = Types.Exact<{
  input: Types.CreateBookmarkInputInput;
}>;

export type CreateBookmarkMutation = {
  __typename?: "Mutation";
  createBookmark: {
    __typename?: "Bookmark";
    created_at: string;
    description?: string | null;
    id: string;
    title: string;
    updated_at: string;
    url: string;
  };
};

export type UpdateBookmarkMutationVariables = Types.Exact<{
  id: Types.Scalars["String"]["input"];
  input: Types.UpdateBookmarkInputInput;
}>;

export type UpdateBookmarkMutation = {
  __typename?: "Mutation";
  updateBookmark: {
    __typename?: "Bookmark";
    created_at: string;
    description?: string | null;
    id: string;
    title: string;
    updated_at: string;
    url: string;
  };
};

export const CreateBookmarkDocument = `
    mutation CreateBookmark($input: CreateBookmarkInputInput!) {
  createBookmark(input: $input) {
    created_at
    description
    id
    title
    updated_at
    url
  }
}
    `;

export const useCreateBookmarkMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateBookmarkMutation,
    TError,
    CreateBookmarkMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateBookmarkMutation,
    TError,
    CreateBookmarkMutationVariables,
    TContext
  >({
    mutationFn: (variables: CreateBookmarkMutationVariables) =>
      graphqlFetcher<CreateBookmarkMutation, CreateBookmarkMutationVariables>(
        CreateBookmarkDocument,
        variables,
      ),
    ...options,
  });
};

useCreateBookmarkMutation.fetcher = (
  variables: CreateBookmarkMutationVariables,
  options?: RequestInit["headers"],
) =>
  graphqlFetcher<CreateBookmarkMutation, CreateBookmarkMutationVariables>(
    CreateBookmarkDocument,
    variables,
    options,
  );

export const UpdateBookmarkDocument = `
    mutation UpdateBookmark($id: String!, $input: UpdateBookmarkInputInput!) {
  updateBookmark(id: $id, input: $input) {
    created_at
    description
    id
    title
    updated_at
    url
  }
}
    `;

export const useUpdateBookmarkMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateBookmarkMutation,
    TError,
    UpdateBookmarkMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateBookmarkMutation,
    TError,
    UpdateBookmarkMutationVariables,
    TContext
  >({
    mutationFn: (variables: UpdateBookmarkMutationVariables) =>
      graphqlFetcher<UpdateBookmarkMutation, UpdateBookmarkMutationVariables>(
        UpdateBookmarkDocument,
        variables,
      ),
    ...options,
  });
};

useUpdateBookmarkMutation.fetcher = (
  variables: UpdateBookmarkMutationVariables,
  options?: RequestInit["headers"],
) =>
  graphqlFetcher<UpdateBookmarkMutation, UpdateBookmarkMutationVariables>(
    UpdateBookmarkDocument,
    variables,
    options,
  );
