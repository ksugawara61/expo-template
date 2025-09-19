import type { Article } from "../../infrastructure/domain/Article";
import * as articleRepository from "../../infrastructure/external/ArticleRepositoryImpl";

export const fetchArticlesUseCase = async (
  page: number,
): Promise<Article[]> => {
  return articleRepository.fetchArticles(page);
};
