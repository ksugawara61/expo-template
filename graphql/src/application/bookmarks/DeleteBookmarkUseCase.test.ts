import { ServiceError } from "@getcronit/pylon";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import { deleteBookmarkUseCase } from "./DeleteBookmarkUseCase";

vi.mock("../../infrastructure/persistence/BookmarkRepository");

const mockBookmarkRepository = vi.mocked(bookmarkRepository);

describe("DeleteBookmarkUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("正常系", () => {
    it("should delete a bookmark successfully", async () => {
      const bookmarkId = "test-id";

      mockBookmarkRepository.deleteBookmark.mockResolvedValue(undefined);

      const result = await deleteBookmarkUseCase(bookmarkId);

      expect(mockBookmarkRepository.deleteBookmark).toHaveBeenCalledWith(
        bookmarkId,
      );
      expect(result).toBe(true);
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when bookmark does not exist", async () => {
      const bookmarkId = "non-existent-id";
      const repositoryError = new Error("No record was found");

      mockBookmarkRepository.deleteBookmark.mockRejectedValue(repositoryError);

      await expect(deleteBookmarkUseCase(bookmarkId)).rejects.toThrow(
        ServiceError,
      );

      try {
        await deleteBookmarkUseCase(bookmarkId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe("Bookmark not found");
          expect(error.extensions?.statusCode).toBe(404);
          expect(error.extensions?.code).toBe("NOT_FOUND");
        }
      }
    });

    it("should throw ServiceError with INTERNAL_ERROR for other repository errors", async () => {
      const bookmarkId = "test-id";
      const repositoryError = new Error("Database connection failed");

      mockBookmarkRepository.deleteBookmark.mockRejectedValue(repositoryError);

      await expect(deleteBookmarkUseCase(bookmarkId)).rejects.toThrow(
        ServiceError,
      );

      try {
        await deleteBookmarkUseCase(bookmarkId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe(
            "Failed to delete bookmark: Database connection failed",
          );
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });

    it("should throw ServiceError with unknown error message when repository throws non-Error", async () => {
      const bookmarkId = "test-id";

      mockBookmarkRepository.deleteBookmark.mockRejectedValue("Unknown error");

      await expect(deleteBookmarkUseCase(bookmarkId)).rejects.toThrow(
        ServiceError,
      );

      try {
        await deleteBookmarkUseCase(bookmarkId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe(
            "Failed to delete bookmark: Unknown error",
          );
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });
  });
});
