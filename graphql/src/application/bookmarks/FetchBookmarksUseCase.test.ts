import { describe, expect, it } from "vitest";
import { prisma } from "../../libs/prisma/client";
import { fetchBookmarksUseCase } from "./FetchBookmarksUseCase";

describe("FetchBookmarksUseCase", () => {
  describe("正常系", () => {
    it("should return array of bookmarks", async () => {
      await prisma.bookmark.createMany({
        data: [
          {
            title: "Test Bookmark 1",
            url: "https://example1.com",
            description: "First test bookmark",
          },
          {
            title: "Test Bookmark 2",
            url: "https://example2.com",
            description: null,
          },
        ],
      });

      const result = await fetchBookmarksUseCase();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("title");
      expect(result[0]).toHaveProperty("url");
      expect(result[0]).toHaveProperty("created_at");
      expect(result[0]).toHaveProperty("updated_at");
    });

    it("should return empty array when no bookmarks exist", async () => {
      const result = await fetchBookmarksUseCase();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
