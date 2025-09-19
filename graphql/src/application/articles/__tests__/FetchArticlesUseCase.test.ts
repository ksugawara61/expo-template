import { describe, expect, it, vi } from "vitest";
import * as articleRepository from "../../../infrastructure/external/ArticleRepository";
import {
  ExternalServiceError,
  InternalServerError,
} from "../../../libs/errors/GraphQLErrors";
import { fetchArticlesUseCase } from "../FetchArticlesUseCase";

// Mock the repository
vi.mock("../../../infrastructure/external/ArticleRepository", () => ({
  fetchArticles: vi.fn(),
}));

const mockFetchArticles = vi.mocked(articleRepository.fetchArticles);

describe("FetchArticlesUseCase", () => {
  it("should fetch articles successfully", async () => {
    const expectedArticles = [
      {
        id: "1",
        title: "Test Article",
        body: "Test content",
        url: "https://example.com/article",
        user: { name: "Test User" },
        tags: [{ name: "test" }],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    mockFetchArticles.mockResolvedValueOnce(expectedArticles);

    const result = await fetchArticlesUseCase(1);

    expect(result).toEqual(expectedArticles);
    expect(mockFetchArticles).toHaveBeenCalledWith(1);
  });

  it("should throw ExternalServiceError for network errors", async () => {
    const error = new Error("fetch failed: network error");
    mockFetchArticles.mockRejectedValueOnce(error);

    await expect(fetchArticlesUseCase(1)).rejects.toThrow(ExternalServiceError);
    await expect(fetchArticlesUseCase(1)).rejects.toThrow(
      "External service 'Qiita API' error:",
    );
  });

  it("should throw ExternalServiceError for fetch errors", async () => {
    const error = new Error("Failed to fetch from external API");
    mockFetchArticles.mockRejectedValueOnce(error);

    await expect(fetchArticlesUseCase(1)).rejects.toThrow(ExternalServiceError);
    await expect(fetchArticlesUseCase(1)).rejects.toThrow(
      "External service 'Qiita API' error:",
    );
  });

  it("should throw InternalServerError for unknown errors", async () => {
    const error = new Error("Unknown error occurred");
    mockFetchArticles.mockRejectedValueOnce(error);

    await expect(fetchArticlesUseCase(1)).rejects.toThrow(InternalServerError);
    await expect(fetchArticlesUseCase(1)).rejects.toThrow(
      "Failed to fetch articles",
    );
  });
});
