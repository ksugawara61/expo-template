import { HttpResponse, http } from "msw";

export const handlers = {
  Success: [
    http.post("*/graphql", async ({ request }) => {
      const body = await request.json();
      const { query } = body as { query: string };

      if (query.includes("createBookmark")) {
        return HttpResponse.json({
          data: {
            createBookmark: {
              id: "1",
              title: "テストブックマーク",
              url: "https://example.com",
              description: "テスト用の説明",
              tags: ["test", "example"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        });
      }

      if (query.includes("updateBookmark")) {
        return HttpResponse.json({
          data: {
            updateBookmark: {
              id: "1",
              title: "更新されたブックマーク",
              url: "https://example.com",
              description: "更新された説明",
              tags: ["updated", "example"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        });
      }

      return HttpResponse.json({ data: {} });
    }),
  ],
};
