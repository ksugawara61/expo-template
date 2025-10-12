import * as Types from '@/libs/graphql/generated/graphql';

import { graphql, type GraphQLResponseResolver, type RequestHandlerOptions } from 'msw'
export type BookmarkFragment = { __typename?: 'Bookmark', created_at: string, description?: string | null, id: string, title: string, updated_at: string, url: string };

export type GetBookmarksQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetBookmarksQuery = { __typename?: 'Query', bookmarks: Array<{ __typename?: 'Bookmark', created_at: string, description?: string | null, id: string, title: string, updated_at: string, url: string }> };

export type DeleteBookmarkMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type DeleteBookmarkMutation = { __typename?: 'Mutation', deleteBookmark: boolean };


/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBookmarksQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { bookmarks }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetBookmarksQuery = (resolver: GraphQLResponseResolver<GetBookmarksQuery, GetBookmarksQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetBookmarksQuery, GetBookmarksQueryVariables>(
    'GetBookmarks',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteBookmarkMutation(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { deleteBookmark }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteBookmarkMutation = (resolver: GraphQLResponseResolver<DeleteBookmarkMutation, DeleteBookmarkMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<DeleteBookmarkMutation, DeleteBookmarkMutationVariables>(
    'DeleteBookmark',
    resolver,
    options
  )
