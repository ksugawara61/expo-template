/*
 * AUTO-GENERATED FILE
 * Aggregated operation -> __typename[] map
 */

export const OPERATION_TYPENAMES = {
  "GetArticlesQuery": [
    "Article"
  ],
  "GetBookmarksQuery": [
    "Bookmark",
    "Tag"
  ],
  "DeleteBookmarkMutation": [],
  "CreateBookmarkMutation": [
    "Bookmark",
    "Tag"
  ],
  "UpdateBookmarkMutation": [
    "Bookmark",
    "Tag"
  ]
} as const;
export type OperationTypenameMap = typeof OPERATION_TYPENAMES;
export type OperationName = keyof OperationTypenameMap;
