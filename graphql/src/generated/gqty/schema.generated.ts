/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { type ScalarsEnumsHash } from "gqty";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Any: { input: any; output: any };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any };
  File: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any };
  /** Custom scalar that handles both integers and floats */
  Number: { input: number; output: number };
  /** Represents NULL values */
  Void: { input: any; output: any };
}

export interface InputInput {
  description?: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
}

export interface InputInput_1 {
  description?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  url?: InputMaybe<Scalars["String"]["input"]>;
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Any: true,
  Boolean: true,
  DateTimeISO: true,
  File: true,
  JSON: true,
  JSONObject: true,
  Number: true,
  String: true,
  Void: true,
};
export const generatedSchema = {
  Article: {
    __typename: { __type: "String!" },
    body: { __type: "String!" },
    created_at: { __type: "String!" },
    id: { __type: "String!" },
    tags: { __type: "[Tag!]!" },
    title: { __type: "String!" },
    updated_at: { __type: "String!" },
    url: { __type: "String!" },
    user: { __type: "User!" },
  },
  Bookmark: {
    __typename: { __type: "String!" },
    created_at: { __type: "DateTimeISO!" },
    description: { __type: "String" },
    id: { __type: "String!" },
    title: { __type: "String!" },
    updated_at: { __type: "DateTimeISO!" },
    url: { __type: "String!" },
  },
  InputInput: {
    description: { __type: "String" },
    title: { __type: "String!" },
    url: { __type: "String!" },
  },
  InputInput_1: {
    description: { __type: "String" },
    title: { __type: "String" },
    url: { __type: "String" },
  },
  Tag: { __typename: { __type: "String!" }, name: { __type: "String!" } },
  User: { __typename: { __type: "String!" }, name: { __type: "String" } },
  mutation: {
    __typename: { __type: "String!" },
    createBookmark: { __type: "Bookmark!", __args: { input: "InputInput!" } },
    deleteBookmark: { __type: "Boolean!", __args: { id: "String!" } },
    updateBookmark: {
      __type: "Bookmark",
      __args: { id: "String!", input: "InputInput_1!" },
    },
  },
  query: {
    __typename: { __type: "String!" },
    articles: { __type: "[Article!]!", __args: { page: "Number!" } },
    bookmark: { __type: "Bookmark", __args: { id: "String!" } },
    bookmarks: { __type: "[Bookmark!]!" },
  },
  subscription: {},
} as const;

export interface Article {
  __typename?: "Article";
  body: ScalarsEnums["String"];
  created_at: ScalarsEnums["String"];
  id: ScalarsEnums["String"];
  tags: Array<Tag>;
  title: ScalarsEnums["String"];
  updated_at: ScalarsEnums["String"];
  url: ScalarsEnums["String"];
  user: User;
}

export interface Bookmark {
  __typename?: "Bookmark";
  created_at: ScalarsEnums["DateTimeISO"];
  description?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["String"];
  title: ScalarsEnums["String"];
  updated_at: ScalarsEnums["DateTimeISO"];
  url: ScalarsEnums["String"];
}

export interface Tag {
  __typename?: "Tag";
  name: ScalarsEnums["String"];
}

export interface User {
  __typename?: "User";
  name?: Maybe<ScalarsEnums["String"]>;
}

export interface Mutation {
  __typename?: "Mutation";
  createBookmark: (args: { input: InputInput }) => Bookmark;
  deleteBookmark: (args: {
    id: ScalarsEnums["String"];
  }) => ScalarsEnums["Boolean"];
  updateBookmark: (args: {
    id: ScalarsEnums["String"];
    input: InputInput_1;
  }) => Maybe<Bookmark>;
}

export interface Query {
  __typename?: "Query";
  articles: (args: { page: ScalarsEnums["Number"] }) => Array<Article>;
  bookmark: (args: { id: ScalarsEnums["String"] }) => Maybe<Bookmark>;
  bookmarks: Array<Bookmark>;
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type ScalarsEnums = {
  [Key in keyof Scalars]: Scalars[Key] extends { output: unknown }
    ? Scalars[Key]["output"]
    : never;
} & {};
