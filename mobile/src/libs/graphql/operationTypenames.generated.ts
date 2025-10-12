/*
 * AUTO-GENERATED FILE
 * Aggregated operation -> __typename[] map
 */

export const OPERATION_TYPENAMES = {
  "GetArticlesQuery": [
    "Article",
    "Query",
    "Tag",
    "User"
  ],
  "CreateBookmarkMutation": [
    "Bookmark",
    "Mutation"
  ],
  "UpdateBookmarkMutation": [
    "Bookmark",
    "Mutation"
  ],
  "GetBookmarksQuery": [
    "Bookmark",
    "Query"
  ],
  "DeleteBookmarkMutation": [
    "Mutation"
  ]
} as const;
export type OperationTypenameMap = typeof OPERATION_TYPENAMES;
export type OperationName = keyof OperationTypenameMap;
export type TypenameOf<O extends OperationName> = OperationTypenameMap[O][number];
