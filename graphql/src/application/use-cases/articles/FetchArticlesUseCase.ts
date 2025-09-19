import type { Article } from "../../../domain/articles/Article";
import * as articleRepository from "../../../infrastructure/external/ArticleRepositoryImpl";

export const fetchArticlesUseCase = async (
  page: number,
): Promise<Article[]> => {
  return articleRepository.fetchArticles(page);
};
