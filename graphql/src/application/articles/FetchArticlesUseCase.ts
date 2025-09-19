import type { Article } from "../../infrastructure/domain/Article";
import * as articleRepository from "../../infrastructure/external/ArticleRepository";

export const fetchArticlesUseCase = async (
  page: number,
): Promise<Article[]> => {
  try {
    return await articleRepository.fetchArticles(page);
  } catch (error) {
    throw new Error(
      `Failed to fetch articles: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
