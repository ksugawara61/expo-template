import * as Types from '@/libs/gql/graphql';

import { graphql, type GraphQLResponseResolver, type RequestHandlerOptions } from 'msw'
export type CreateBookmarkMutationVariables = Types.Exact<{
  input: Types.InputInput;
}>;


export type CreateBookmarkMutation = { __typename?: 'Mutation', createBookmark: { __typename?: 'Bookmark', created_at: string, description?: string | null, id: string, title: string, updated_at: string, url: string } };

export type UpdateBookmarkMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  input: Types.InputInput_1;
}>;


export type UpdateBookmarkMutation = { __typename?: 'Mutation', updateBookmark?: { __typename?: 'Bookmark', created_at: string, description?: string | null, id: string, title: string, updated_at: string, url: string } | null };


/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateBookmarkMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createBookmark }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateBookmarkMutation = (resolver: GraphQLResponseResolver<CreateBookmarkMutation, CreateBookmarkMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<CreateBookmarkMutation, CreateBookmarkMutationVariables>(
    'CreateBookmark',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateBookmarkMutation(
 *   ({ query, variables }) => {
 *     const { id, input } = variables;
 *     return HttpResponse.json({
 *       data: { updateBookmark }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateBookmarkMutation = (resolver: GraphQLResponseResolver<UpdateBookmarkMutation, UpdateBookmarkMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<UpdateBookmarkMutation, UpdateBookmarkMutationVariables>(
    'UpdateBookmark',
    resolver,
    options
  )
