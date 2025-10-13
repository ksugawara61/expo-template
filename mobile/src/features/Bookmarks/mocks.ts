import { HttpResponse } from "msw";
import { createMockQuery } from "@/libs/graphql/msw-utils";
import { GET_BOOKMARKS } from "./index";

const success = createMockQuery(GET_BOOKMARKS, ({ variables: _ }) => {
  return HttpResponse.json({
    data: {
      bookmarks: [
        {
          __typename: "Bookmark" as const,
          id: "1",
          title: "React NativeとExpoで始めるモバイルアプリ開発",
          url: "https://qiita.com/qiita/items/c686397e4a0f4f11683d",
          description:
            "React NativeとExpoを使ったモバイルアプリ開発の入門記事です。",
          created_at: "2024-01-15T09:00:00+09:00",
          updated_at: "2024-01-15T09:00:00+09:00",
        },
        {
          __typename: "Bookmark" as const,
          id: "2",
          title: "NativeWindでReact Nativeのスタイリングを効率化",
          url: "https://qiita.com/developer/items/d797508f5b1f5f22794e",
          description:
            "NativeWindを使ってReact Nativeのスタイリングを効率化する方法を解説します。",
          created_at: "2024-01-10T14:30:00+09:00",
          updated_at: "2024-01-10T14:30:00+09:00",
        },
      ],
    },
  });
});

const empty = createMockQuery(GET_BOOKMARKS, ({ variables: _ }) => {
  return HttpResponse.json({
    data: {
      bookmarks: [],
    },
  });
});

export const MocksBookmarks = {
  success,
  empty,
};
