import type { Article } from "../../infrastructure/domain/Article";
import * as articleRepository from "../../infrastructure/external/ArticleRepository";
import {
  ExternalServiceError,
  InternalServerError,
} from "../../libs/errors/GraphQLErrors";

export const fetchArticlesUseCase = async (
  page: number,
): Promise<Article[]> => {
  try {
    return await articleRepository.fetchArticles(page);
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching articles:", error);

    // Check if it's a network/external service error
    if (error instanceof Error) {
      if (
        error.message.includes("fetch") ||
        error.message.includes("network")
      ) {
        throw new ExternalServiceError("Qiita API", error.message);
      }
    }

    // For any other error, throw a generic internal server error
    throw new InternalServerError("Failed to fetch articles");
  }
};
