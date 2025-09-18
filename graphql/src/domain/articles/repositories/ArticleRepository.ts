import type { Article } from "../entities";

export interface ArticleRepository {
  fetchArticles(page: number): Promise<Article[]>;
}
