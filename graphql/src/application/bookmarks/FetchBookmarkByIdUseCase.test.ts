import { ServiceError } from "@getcronit/pylon";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import { fetchBookmarkByIdUseCase } from "./FetchBookmarkByIdUseCase";

vi.mock("../../infrastructure/persistence/BookmarkRepository");

const mockBookmarkRepository = vi.mocked(bookmarkRepository);

describe("FetchBookmarkByIdUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("正常系", () => {
    it("should return bookmark when found", async () => {
      const bookmarkId = "test-id";
      const expectedBookmark = {
        id: bookmarkId,
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBookmarkRepository.findById.mockResolvedValue(expectedBookmark);

      const result = await fetchBookmarkByIdUseCase(bookmarkId);

      expect(mockBookmarkRepository.findById).toHaveBeenCalledWith(bookmarkId);
      expect(result).toEqual(expectedBookmark);
    });

    it("should return null when bookmark not found", async () => {
      const bookmarkId = "non-existent-id";

      mockBookmarkRepository.findById.mockResolvedValue(null);

      const result = await fetchBookmarkByIdUseCase(bookmarkId);

      expect(mockBookmarkRepository.findById).toHaveBeenCalledWith(bookmarkId);
      expect(result).toBeNull();
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an error", async () => {
      const bookmarkId = "test-id";
      const repositoryError = new Error("Database connection failed");

      mockBookmarkRepository.findById.mockRejectedValue(repositoryError);

      await expect(fetchBookmarkByIdUseCase(bookmarkId)).rejects.toThrow(
        ServiceError,
      );

      try {
        await fetchBookmarkByIdUseCase(bookmarkId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe(
            "Failed to fetch bookmark: Database connection failed",
          );
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });

    it("should throw ServiceError with unknown error message when repository throws non-Error", async () => {
      const bookmarkId = "test-id";

      mockBookmarkRepository.findById.mockRejectedValue("Unknown error");

      await expect(fetchBookmarkByIdUseCase(bookmarkId)).rejects.toThrow(
        ServiceError,
      );

      try {
        await fetchBookmarkByIdUseCase(bookmarkId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe("Failed to fetch bookmark: Unknown error");
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });
  });
});
