import * as Types from '@/libs/graphql/generated/graphql';

import { graphql, type GraphQLResponseResolver, type RequestHandlerOptions } from 'msw'
export type GetArticlesQueryVariables = Types.Exact<{
  page: Types.Scalars['Number']['input'];
}>;


export type GetArticlesQuery = { __typename?: 'Query', articles: Array<{ __typename?: 'Article', created_at: string, id: string, title: string, tags: Array<{ __typename?: 'Tag', name: string }>, user: { __typename?: 'User', name?: string | null } }> };


/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetArticlesQuery(
 *   ({ query, variables }) => {
 *     const { page } = variables;
 *     return HttpResponse.json({
 *       data: { articles }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetArticlesQuery = (resolver: GraphQLResponseResolver<GetArticlesQuery, GetArticlesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetArticlesQuery, GetArticlesQueryVariables>(
    'GetArticles',
    resolver,
    options
  )
