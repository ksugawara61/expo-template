import * as articleRepository from "../../infrastructure/external/ArticleRepositoryImpl";
import type { Article } from "../../infrastructure/domain/Article";

export const fetchArticlesUseCase = async (
  page: number,
): Promise<Article[]> => {
  return articleRepository.fetchArticles(page);
};
