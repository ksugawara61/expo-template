import { HttpResponse } from "msw";
import { createMockMutation } from "@/libs/graphql/msw-utils";
import { CREATE_BOOKMARK, UPDATE_BOOKMARK } from "./index";

const createBookmarkSuccess = createMockMutation(CREATE_BOOKMARK, () => {
  return HttpResponse.json({
    data: {
      createBookmark: {
        id: "1",
        title: "テストブックマーク",
        url: "https://example.com",
        description: "テスト用の説明",
        tags: [
          { id: "1", name: "test" },
          { id: "2", name: "example" },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  });
});

const updateBookmarkSuccess = createMockMutation(UPDATE_BOOKMARK, () => {
  return HttpResponse.json({
    data: {
      updateBookmark: {
        id: "1",
        title: "更新されたブックマーク",
        url: "https://example.com",
        description: "更新された説明",
        tags: [
          { id: "1", name: "updated" },
          { id: "2", name: "example" },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  });
});

export const handlers = {
  Success: [createBookmarkSuccess, updateBookmarkSuccess],
};
