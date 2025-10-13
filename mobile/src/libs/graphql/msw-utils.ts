/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  type GraphQLResponseResolver,
  type GraphQLVariables,
  graphql,
  type RequestHandlerOptions,
} from "msw";

/**
 * TypedDocumentNodeからGraphQL操作名を抽出
 */
const getOperationName = (document: TypedDocumentNode<any, any>): string => {
  const definition = document.definitions?.[0];
  if (definition?.kind === "OperationDefinition" && definition.name?.value) {
    return definition.name.value;
  }
  throw new Error("Unable to extract operation name from document");
};

/**
 * GraphQLクエリ用のMSWハンドラーを作成
 */
export const createMockQuery = <
  TResult = any,
  TVariables extends GraphQLVariables = GraphQLVariables,
>(document: TypedDocumentNode<TResult, TVariables>, resolver: GraphQLResponseResolver<any, TVariables>, options?: RequestHandlerOptions) => {
  const operationName = getOperationName(document);
  return graphql.query<any, TVariables>(operationName, resolver, options);
};

/**
 * GraphQLミューテーション用のMSWハンドラーを作成
 */
export const createMockMutation = <
  TResult = any,
  TVariables extends GraphQLVariables = GraphQLVariables,
>(document: TypedDocumentNode<TResult, TVariables>, resolver: GraphQLResponseResolver<any, TVariables>, options?: RequestHandlerOptions) => {
  const operationName = getOperationName(document);
  return graphql.mutation<any, TVariables>(operationName, resolver, options);
};
