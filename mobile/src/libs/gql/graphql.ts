/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: any; output: any; }
  Date: { input: string; output: string; }
  File: { input: any; output: any; }
  JSON: { input: unknown; output: unknown; }
  Number: { input: any; output: any; }
  Object: { input: any; output: any; }
  Void: { input: any; output: any; }
};

export type Article = {
  __typename?: 'Article';
  body: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  id: Scalars['String']['output'];
  tags: Array<Tag>;
  title: Scalars['String']['output'];
  updated_at: Scalars['String']['output'];
  url: Scalars['String']['output'];
  user: User;
};

export type Bookmark = {
  __typename?: 'Bookmark';
  created_at: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updated_at: Scalars['Date']['output'];
  url: Scalars['String']['output'];
};

export type CreateBookmarkInputInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBookmark: Bookmark;
  deleteBookmark: Scalars['Boolean']['output'];
  updateBookmark: Bookmark;
};


export type MutationCreateBookmarkArgs = {
  input: CreateBookmarkInputInput;
};


export type MutationDeleteBookmarkArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateBookmarkArgs = {
  id: Scalars['String']['input'];
  input: UpdateBookmarkInputInput;
};

export type Query = {
  __typename?: 'Query';
  articles: Array<Article>;
  bookmark?: Maybe<Bookmark>;
  bookmarks: Array<Bookmark>;
};


export type QueryArticlesArgs = {
  page: Scalars['Number']['input'];
};


export type QueryBookmarkArgs = {
  id: Scalars['String']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  name: Scalars['String']['output'];
};

export type UpdateBookmarkInputInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  name?: Maybe<Scalars['String']['output']>;
};

export type GetArticlesQueryVariables = Exact<{
  page: Scalars['Number']['input'];
}>;


export type GetArticlesQuery = { __typename?: 'Query', articles: Array<{ __typename?: 'Article', created_at: string, id: string, title: string, tags: Array<{ __typename?: 'Tag', name: string }>, user: { __typename?: 'User', name?: string | null } }> };

export type CreateBookmarkMutationVariables = Exact<{
  input: CreateBookmarkInputInput;
}>;


export type CreateBookmarkMutation = { __typename?: 'Mutation', createBookmark: { __typename?: 'Bookmark', created_at: string, description?: string | null, id: string, title: string, updated_at: string, url: string } };

export type UpdateBookmarkMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateBookmarkInputInput;
}>;


export type UpdateBookmarkMutation = { __typename?: 'Mutation', updateBookmark: { __typename?: 'Bookmark', created_at: string, description?: string | null, id: string, title: string, updated_at: string, url: string } };

export type BookmarkFragment = { __typename?: 'Bookmark', created_at: string, description?: string | null, id: string, title: string, updated_at: string, url: string } & { ' $fragmentName'?: 'BookmarkFragment' };

export type GetBookmarksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBookmarksQuery = { __typename?: 'Query', bookmarks: Array<(
    { __typename?: 'Bookmark' }
    & { ' $fragmentRefs'?: { 'BookmarkFragment': BookmarkFragment } }
  )> };

export type DeleteBookmarkMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteBookmarkMutation = { __typename?: 'Mutation', deleteBookmark: boolean };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const BookmarkFragmentDoc = new TypedDocumentString(`
    fragment Bookmark on Bookmark {
  created_at
  description
  id
  title
  updated_at
  url
}
    `, {"fragmentName":"Bookmark"}) as unknown as TypedDocumentString<BookmarkFragment, unknown>;
export const GetArticlesDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<GetArticlesQuery, GetArticlesQueryVariables>;
export const CreateBookmarkDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<CreateBookmarkMutation, CreateBookmarkMutationVariables>;
export const UpdateBookmarkDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<UpdateBookmarkMutation, UpdateBookmarkMutationVariables>;
export const GetBookmarksDocument = new TypedDocumentString(`
    query GetBookmarks {
  bookmarks {
    ...Bookmark
  }
}
    fragment Bookmark on Bookmark {
  created_at
  description
  id
  title
  updated_at
  url
}`) as unknown as TypedDocumentString<GetBookmarksQuery, GetBookmarksQueryVariables>;
export const DeleteBookmarkDocument = new TypedDocumentString(`
    mutation DeleteBookmark($id: String!) {
  deleteBookmark(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteBookmarkMutation, DeleteBookmarkMutationVariables>;