import { ServiceError } from "@getcronit/pylon";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import { updateBookmarkUseCase } from "./UpdateBookmarkUseCase";

vi.mock("../../infrastructure/persistence/BookmarkRepository");

const mockBookmarkRepository = vi.mocked(bookmarkRepository);

describe("UpdateBookmarkUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("正常系", () => {
    it("should update a bookmark successfully", async () => {
      const bookmarkId = "test-id";
      const updateInput = {
        title: "Updated Title",
        description: "Updated description",
      };

      const expectedBookmark = {
        id: bookmarkId,
        title: updateInput.title,
        url: "https://example.com",
        description: updateInput.description,
        created_at: new Date("2024-01-01"),
        updated_at: new Date("2024-01-02"),
      };

      mockBookmarkRepository.update.mockResolvedValue(expectedBookmark);

      const result = await updateBookmarkUseCase(bookmarkId, updateInput);

      expect(mockBookmarkRepository.update).toHaveBeenCalledWith(
        bookmarkId,
        updateInput,
      );
      expect(result).toEqual(expectedBookmark);
    });

    it("should update partial fields only", async () => {
      const bookmarkId = "test-id";
      const updateInput = {
        title: "Updated Title Only",
      };

      const expectedBookmark = {
        id: bookmarkId,
        title: updateInput.title,
        url: "https://example.com",
        description: "Original description",
        created_at: new Date("2024-01-01"),
        updated_at: new Date("2024-01-02"),
      };

      mockBookmarkRepository.update.mockResolvedValue(expectedBookmark);

      const result = await updateBookmarkUseCase(bookmarkId, updateInput);

      expect(mockBookmarkRepository.update).toHaveBeenCalledWith(
        bookmarkId,
        updateInput,
      );
      expect(result).toEqual(expectedBookmark);
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when bookmark does not exist", async () => {
      const bookmarkId = "non-existent-id";
      const updateInput = {
        title: "Updated Title",
      };

      const repositoryError = new Error("No record was found");
      mockBookmarkRepository.update.mockRejectedValue(repositoryError);

      await expect(
        updateBookmarkUseCase(bookmarkId, updateInput),
      ).rejects.toThrow(ServiceError);

      try {
        await updateBookmarkUseCase(bookmarkId, updateInput);
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
      const updateInput = {
        title: "Updated Title",
      };

      const repositoryError = new Error("Database connection failed");
      mockBookmarkRepository.update.mockRejectedValue(repositoryError);

      await expect(
        updateBookmarkUseCase(bookmarkId, updateInput),
      ).rejects.toThrow(ServiceError);

      try {
        await updateBookmarkUseCase(bookmarkId, updateInput);
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe(
            "Failed to update bookmark: Database connection failed",
          );
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });

    it("should throw ServiceError with unknown error message when repository throws non-Error", async () => {
      const bookmarkId = "test-id";
      const updateInput = {
        title: "Updated Title",
      };

      mockBookmarkRepository.update.mockRejectedValue("Unknown error");

      await expect(
        updateBookmarkUseCase(bookmarkId, updateInput),
      ).rejects.toThrow(ServiceError);

      try {
        await updateBookmarkUseCase(bookmarkId, updateInput);
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe(
            "Failed to update bookmark: Unknown error",
          );
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });
  });
});
