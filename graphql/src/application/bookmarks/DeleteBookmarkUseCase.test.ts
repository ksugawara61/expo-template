import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../../libs/prisma/client";
import { deleteBookmarkUseCase } from "./DeleteBookmarkUseCase";

describe("DeleteBookmarkUseCase", () => {
  beforeEach(async () => {
    await prisma.bookmark.deleteMany();
  });

  afterEach(async () => {
    await prisma.bookmark.deleteMany();
  });

  describe("正常系", () => {
    it("should delete a bookmark successfully", async () => {
      const bookmark = await prisma.bookmark.create({
        data: {
          title: "Test Bookmark",
          url: "https://example.com",
          description: "A test bookmark",
        },
      });

      const result = await deleteBookmarkUseCase(bookmark.id);

      expect(result).toBe(true);

      const deletedBookmark = await prisma.bookmark.findUnique({
        where: { id: bookmark.id },
      });
      expect(deletedBookmark).toBeNull();
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when bookmark does not exist", async () => {
      const nonExistentId = "non-existent-id";

      await expect(deleteBookmarkUseCase(nonExistentId)).rejects.toThrowError(
        expect.objectContaining({
          message: "Bookmark not found",
        }),
      );
    });
  });
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
