import type { ArticleRepository } from "../../../domain/articles/repositories/ArticleRepository";
import type { Article } from "../../../domain/articles/entities";

export class FetchArticlesUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(page: number): Promise<Article[]> {
    return this.articleRepository.fetchArticles(page);
  }
}