import { HttpResponse } from "msw";
import { createMockQuery } from "@/libs/graphql/msw-utils";
import { GetArticles } from "./index";

const mockData = [
  {
    __typename: "Article" as const,
    id: "c686397e4a0f4f11683d",
    title: "React NativeとExpoで始めるモバイルアプリ開発",
    body: "# React NativeとExpoで始めるモバイルアプリ開発\n\n...",
    url: "https://qiita.com/qiita/items/c686397e4a0f4f11683d",
    user: {
      name: "Qiita 太郎",
    },
    tags: [{ name: "React Native" }, { name: "Expo" }, { name: "TypeScript" }],
    created_at: "2024-01-15T09:00:00+09:00",
  },
  {
    __typename: "Article" as const,
    id: "d797508f5b1f5f22794e",
    title: "NativeWindでReact Nativeのスタイリングを効率化",
    body: "# NativeWindでReact Nativeのスタイリングを効率化\n\n...",
    url: "https://qiita.com/developer/items/d797508f5b1f5f22794e",
    user: {
      name: "Developer Taro",
    },
    tags: [
      { name: "NativeWind" },
      { name: "TailwindCSS" },
      { name: "React Native" },
    ],
    created_at: "2024-01-10T14:30:00+09:00",
  },
];

const success = createMockQuery(GetArticles, ({ variables: _ }) => {
  return HttpResponse.json({
    data: {
      articles: mockData,
    },
  });
});

const empty = createMockQuery(GetArticles, ({ variables: _ }) => {
  return HttpResponse.json({
    data: {
      articles: [],
    },
  });
});

export const handlers = {
  Success: [success],
  Empty: [empty],
};
