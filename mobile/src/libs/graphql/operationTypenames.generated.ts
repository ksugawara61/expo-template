/*
 * AUTO-GENERATED FILE
 * Aggregated operation -> __typename[] map
 */

export const OPERATION_TYPENAMES = {
  "GetArticlesQuery": [
    "Article",
    "Tag_1",
    "User"
  ],
  "CreateBookmarkMutation": [
    "Bookmark"
  ],
  "UpdateBookmarkMutation": [
    "Bookmark"
  ],
  "GetBookmarksQuery": [
    "Bookmark"
  ],
  "DeleteBookmarkMutation": []
} as const;
export type OperationTypenameMap = typeof OPERATION_TYPENAMES;
export type OperationName = keyof OperationTypenameMap;
