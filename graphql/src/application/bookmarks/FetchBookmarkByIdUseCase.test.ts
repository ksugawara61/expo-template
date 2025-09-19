import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../../libs/prisma/client";
import { fetchBookmarkByIdUseCase } from "./FetchBookmarkByIdUseCase";

describe("FetchBookmarkByIdUseCase", () => {
  beforeEach(async () => {
    await prisma.bookmark.deleteMany();
  });

  afterEach(async () => {
    await prisma.bookmark.deleteMany();
  });

  describe("正常系", () => {
    it("should return bookmark when found", async () => {
      const bookmark = await prisma.bookmark.create({
        data: {
          title: "Test Bookmark",
          url: "https://example.com",
          description: "A test bookmark",
        },
      });

      const result = await fetchBookmarkByIdUseCase(bookmark.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(bookmark.id);
      expect(result?.title).toBe(bookmark.title);
      expect(result?.url).toBe(bookmark.url);
      expect(result?.description).toBe(bookmark.description);
    });

    it("should return null when bookmark not found", async () => {
      const nonExistentId = "non-existent-id";

      const result = await fetchBookmarkByIdUseCase(nonExistentId);

      expect(result).toBeNull();
    });
  });
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
