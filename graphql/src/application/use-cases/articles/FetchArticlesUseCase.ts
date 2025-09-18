import type { Article } from "../../../domain/articles/Article";
import * as articleRepository from "../../../infrastructure/repositories/ArticleRepositoryImpl";

export const execute = async (page: number): Promise<Article[]> => {
  return articleRepository.fetchArticles(page);
};
