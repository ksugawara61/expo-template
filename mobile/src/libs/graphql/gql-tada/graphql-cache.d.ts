/* eslint-disable */
/* prettier-ignore */
import type { TadaDocumentNode, $tada } from 'gql.tada';
import type { introspection } from "./graphql-env.d";

declare module 'gql.tada' {
 interface setupCache {
    "\n  query GetArticles($page: Number!) {\n    articles(page: $page) {\n      __typename\n      created_at\n      id\n      tags {\n        name\n      }\n      title\n      user {\n        name\n      }\n    }\n  }\n":
      TadaDocumentNode<{ articles: { __typename: "Article"; created_at: string; id: string; tags: { name: string; }[]; title: string; user: { name: string | null; }; }[]; }, { page: unknown; }, void>;
    "\n  fragment Bookmark on Bookmark {\n    __typename\n    created_at\n    description\n    id\n    tags {\n      id\n      name\n    }\n    title\n    updated_at\n    url\n  }\n":
      TadaDocumentNode<{ __typename: "Bookmark"; created_at: string; description: string | null; id: string; tags: { id: string; name: string; }[] | null; title: string; updated_at: string; url: string; }, {}, { fragment: "Bookmark"; on: "Bookmark"; masked: true; }>;
    "\n  query GetBookmarks {\n    bookmarks {\n      ...Bookmark\n    }\n  }\n":
      TadaDocumentNode<{ bookmarks: { [$tada.fragmentRefs]: { Bookmark: "Bookmark"; }; }[]; }, {}, void>;
    "\n  mutation DeleteBookmark($id: String!) {\n    deleteBookmark(id: $id)\n  }\n":
      TadaDocumentNode<{ deleteBookmark: boolean; }, { id: string; }, void>;
    "\n  mutation CreateBookmark($input: CreateBookmarkInputInput!) {\n    createBookmark(input: $input) {\n      __typename\n      created_at\n      description\n      id\n      tags {\n        id\n        name\n      }\n      title\n      updated_at\n      url\n    }\n  }\n":
      TadaDocumentNode<{ createBookmark: { __typename: "Bookmark"; created_at: string; description: string | null; id: string; tags: { id: string; name: string; }[] | null; title: string; updated_at: string; url: string; }; }, { input: { tagNames?: string[] | null | undefined; description?: string | null | undefined; url: string; title: string; }; }, void>;
    "\n  mutation UpdateBookmark($id: String!, $input: UpdateBookmarkInputInput!) {\n    updateBookmark(id: $id, input: $input) {\n      __typename\n      created_at\n      description\n      id\n      tags {\n        id\n        name\n      }\n      title\n      updated_at\n      url\n    }\n  }\n":
      TadaDocumentNode<{ updateBookmark: { __typename: "Bookmark"; created_at: string; description: string | null; id: string; tags: { id: string; name: string; }[] | null; title: string; updated_at: string; url: string; }; }, { input: { tagNames?: string[] | null | undefined; description?: string | null | undefined; url?: string | null | undefined; title?: string | null | undefined; }; id: string; }, void>;
  }
}
