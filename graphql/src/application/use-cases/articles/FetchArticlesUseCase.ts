import type { Article } from "../../../domain/articles/entities";
import type { ArticleRepository } from "../../../domain/articles/repositories/ArticleRepository";

export class FetchArticlesUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(page: number): Promise<Article[]> {
    return this.articleRepository.fetchArticles(page);
  }
}
