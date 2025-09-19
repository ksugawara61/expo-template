import { ServiceError } from "@getcronit/pylon";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import { fetchBookmarksUseCase } from "./FetchBookmarksUseCase";

vi.mock("../../infrastructure/persistence/BookmarkRepository");

const mockBookmarkRepository = vi.mocked(bookmarkRepository);

describe("FetchBookmarksUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("正常系", () => {
    it("should return array of bookmarks", async () => {
      const expectedBookmarks = [
        {
          id: "bookmark-1",
          title: "Test Bookmark 1",
          url: "https://example1.com",
          description: "First test bookmark",
          created_at: new Date("2024-01-01"),
          updated_at: new Date("2024-01-01"),
        },
        {
          id: "bookmark-2",
          title: "Test Bookmark 2",
          url: "https://example2.com",
          description: null,
          created_at: new Date("2024-01-02"),
          updated_at: new Date("2024-01-02"),
        },
      ];

      mockBookmarkRepository.findMany.mockResolvedValue(expectedBookmarks);

      const result = await fetchBookmarksUseCase();

      expect(mockBookmarkRepository.findMany).toHaveBeenCalledWith();
      expect(result).toEqual(expectedBookmarks);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no bookmarks exist", async () => {
      mockBookmarkRepository.findMany.mockResolvedValue([]);

      const result = await fetchBookmarksUseCase();

      expect(mockBookmarkRepository.findMany).toHaveBeenCalledWith();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an error", async () => {
      const repositoryError = new Error("Database connection failed");

      mockBookmarkRepository.findMany.mockRejectedValue(repositoryError);

      await expect(fetchBookmarksUseCase()).rejects.toThrow(ServiceError);

      try {
        await fetchBookmarksUseCase();
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe(
            "Failed to fetch bookmarks: Database connection failed",
          );
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });

    it("should throw ServiceError with unknown error message when repository throws non-Error", async () => {
      mockBookmarkRepository.findMany.mockRejectedValue("Unknown error");

      await expect(fetchBookmarksUseCase()).rejects.toThrow(ServiceError);

      try {
        await fetchBookmarksUseCase();
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe(
            "Failed to fetch bookmarks: Unknown error",
          );
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });
  });
});
