import { describe, expect, it, vi } from "vitest";
import * as bookmarkRepository from "../../../infrastructure/persistence/BookmarkRepository";
import {
  BadRequestError,
  InternalServerError,
} from "../../../libs/errors/GraphQLErrors";
import { createBookmarkUseCase } from "../CreateBookmarkUseCase";

// Mock the repository
vi.mock("../../../infrastructure/persistence/BookmarkRepository", () => ({
  create: vi.fn(),
}));

const mockCreate = vi.mocked(bookmarkRepository.create);

describe("CreateBookmarkUseCase", () => {
  it("should create bookmark successfully", async () => {
    const input = {
      title: "Test Bookmark",
      url: "https://example.com",
      description: "Test description",
    };

    const expectedBookmark = {
      id: "1",
      ...input,
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockCreate.mockResolvedValueOnce(expectedBookmark);

    const result = await createBookmarkUseCase(input);

    expect(result).toEqual(expectedBookmark);
    expect(mockCreate).toHaveBeenCalledWith(input);
  });

  it("should throw BadRequestError for unique constraint violation", async () => {
    const input = {
      title: "Test Bookmark",
      url: "https://example.com",
      description: "Test description",
    };

    const error = new Error("Unique constraint failed on the fields: (url)");
    mockCreate.mockRejectedValueOnce(error);

    await expect(createBookmarkUseCase(input)).rejects.toThrow(BadRequestError);
    await expect(createBookmarkUseCase(input)).rejects.toThrow(
      "A bookmark with this URL already exists",
    );
  });

  it("should throw BadRequestError for validation errors", async () => {
    const input = {
      title: "",
      url: "invalid-url",
      description: "Test description",
    };

    const error = new Error("Invalid url format required");
    mockCreate.mockRejectedValueOnce(error);

    await expect(createBookmarkUseCase(input)).rejects.toThrow(BadRequestError);
    await expect(createBookmarkUseCase(input)).rejects.toThrow(
      "Invalid input:",
    );
  });

  it("should throw InternalServerError for unknown errors", async () => {
    const input = {
      title: "Test Bookmark",
      url: "https://example.com",
      description: "Test description",
    };

    const error = new Error("Database connection failed");
    mockCreate.mockRejectedValueOnce(error);

    await expect(createBookmarkUseCase(input)).rejects.toThrow(
      InternalServerError,
    );
    await expect(createBookmarkUseCase(input)).rejects.toThrow(
      "Failed to create bookmark",
    );
  });
});
