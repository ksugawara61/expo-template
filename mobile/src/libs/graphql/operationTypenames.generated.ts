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
    "Bookmark",
    "Tag"
  ],
  "UpdateBookmarkMutation": [
    "Bookmark",
    "Tag"
  ],
  "GetBookmarksQuery": [
    "Bookmark",
    "Tag"
  ],
  "DeleteBookmarkMutation": []
} as const;
export type OperationTypenameMap = typeof OPERATION_TYPENAMES;
export type OperationName = keyof OperationTypenameMap;