import { ServiceError } from "@getcronit/pylon";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import { createBookmarkUseCase } from "./CreateBookmarkUseCase";

vi.mock("../../infrastructure/persistence/BookmarkRepository");

const mockBookmarkRepository = vi.mocked(bookmarkRepository);

describe("CreateBookmarkUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("正常系", () => {
    it("should create a bookmark successfully", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
      };

      const expectedBookmark = {
        id: "test-id",
        title: input.title,
        url: input.url,
        description: input.description,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBookmarkRepository.create.mockResolvedValue(expectedBookmark);

      const result = await createBookmarkUseCase(input);

      expect(mockBookmarkRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedBookmark);
    });

    it("should create a bookmark without description", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
      };

      const expectedBookmark = {
        id: "test-id",
        title: input.title,
        url: input.url,
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBookmarkRepository.create.mockResolvedValue(expectedBookmark);

      const result = await createBookmarkUseCase(input);

      expect(mockBookmarkRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedBookmark);
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an error", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
      };

      const repositoryError = new Error("Database connection failed");
      mockBookmarkRepository.create.mockRejectedValue(repositoryError);

      await expect(createBookmarkUseCase(input)).rejects.toThrow(ServiceError);

      try {
        await createBookmarkUseCase(input);
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe(
            "Failed to create bookmark: Database connection failed",
          );
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });

    it("should throw ServiceError with unknown error message when repository throws non-Error", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
      };

      mockBookmarkRepository.create.mockRejectedValue("Unknown error");

      await expect(createBookmarkUseCase(input)).rejects.toThrow(ServiceError);

      try {
        await createBookmarkUseCase(input);
      } catch (error) {
        expect(error).toBeInstanceOf(ServiceError);
        if (error instanceof ServiceError) {
          expect(error.message).toBe(
            "Failed to create bookmark: Unknown error",
          );
          expect(error.extensions?.statusCode).toBe(500);
          expect(error.extensions?.code).toBe("INTERNAL_ERROR");
        }
      }
    });
  });
});
