/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetArticles($page: Number!) {\n    articles(page: $page) {\n      created_at\n      id\n      tags {\n        name\n      }\n      title\n      user {\n        name\n      }\n    }\n  }\n": typeof types.GetArticlesDocument,
    "\n  mutation CreateBookmark($input: CreateBookmarkInputInput!) {\n    createBookmark(input: $input) {\n      created_at\n      description\n      id\n      title\n      updated_at\n      url\n    }\n  }\n": typeof types.CreateBookmarkDocument,
    "\n  mutation UpdateBookmark($id: String!, $input: UpdateBookmarkInputInput!) {\n    updateBookmark(id: $id, input: $input) {\n      created_at\n      description\n      id\n      title\n      updated_at\n      url\n    }\n  }\n": typeof types.UpdateBookmarkDocument,
    "\n  fragment Bookmark on Bookmark {\n    created_at\n    description\n    id\n    title\n    updated_at\n    url\n  }\n": typeof types.BookmarkFragmentDoc,
    "\n  query GetBookmarks {\n    bookmarks {\n      ...Bookmark\n    }\n  }\n": typeof types.GetBookmarksDocument,
    "\n  mutation DeleteBookmark($id: String!) {\n    deleteBookmark(id: $id)\n  }\n": typeof types.DeleteBookmarkDocument,
};
const documents: Documents = {
    "\n  query GetArticles($page: Number!) {\n    articles(page: $page) {\n      created_at\n      id\n      tags {\n        name\n      }\n      title\n      user {\n        name\n      }\n    }\n  }\n": types.GetArticlesDocument,
    "\n  mutation CreateBookmark($input: CreateBookmarkInputInput!) {\n    createBookmark(input: $input) {\n      created_at\n      description\n      id\n      title\n      updated_at\n      url\n    }\n  }\n": types.CreateBookmarkDocument,
    "\n  mutation UpdateBookmark($id: String!, $input: UpdateBookmarkInputInput!) {\n    updateBookmark(id: $id, input: $input) {\n      created_at\n      description\n      id\n      title\n      updated_at\n      url\n    }\n  }\n": types.UpdateBookmarkDocument,
    "\n  fragment Bookmark on Bookmark {\n    created_at\n    description\n    id\n    title\n    updated_at\n    url\n  }\n": types.BookmarkFragmentDoc,
    "\n  query GetBookmarks {\n    bookmarks {\n      ...Bookmark\n    }\n  }\n": types.GetBookmarksDocument,
    "\n  mutation DeleteBookmark($id: String!) {\n    deleteBookmark(id: $id)\n  }\n": types.DeleteBookmarkDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetArticles($page: Number!) {\n    articles(page: $page) {\n      created_at\n      id\n      tags {\n        name\n      }\n      title\n      user {\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').GetArticlesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBookmark($input: CreateBookmarkInputInput!) {\n    createBookmark(input: $input) {\n      created_at\n      description\n      id\n      title\n      updated_at\n      url\n    }\n  }\n"): typeof import('./graphql').CreateBookmarkDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateBookmark($id: String!, $input: UpdateBookmarkInputInput!) {\n    updateBookmark(id: $id, input: $input) {\n      created_at\n      description\n      id\n      title\n      updated_at\n      url\n    }\n  }\n"): typeof import('./graphql').UpdateBookmarkDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Bookmark on Bookmark {\n    created_at\n    description\n    id\n    title\n    updated_at\n    url\n  }\n"): typeof import('./graphql').BookmarkFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBookmarks {\n    bookmarks {\n      ...Bookmark\n    }\n  }\n"): typeof import('./graphql').GetBookmarksDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteBookmark($id: String!) {\n    deleteBookmark(id: $id)\n  }\n"): typeof import('./graphql').DeleteBookmarkDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
