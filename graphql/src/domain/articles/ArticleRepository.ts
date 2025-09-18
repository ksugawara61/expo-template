import type { Article } from "./Article";

export type ArticleRepository = {
  fetchArticles(page: number): Promise<Article[]>;
};
