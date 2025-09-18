import { FetchArticlesUseCase } from "../../application/use-cases/articles";
import { ArticleRepositoryImpl } from "../../infrastructure/repositories";

export class ArticleController {
  private readonly fetchArticlesUseCase: FetchArticlesUseCase;

  constructor() {
    const articleRepository = new ArticleRepositoryImpl();
    this.fetchArticlesUseCase = new FetchArticlesUseCase(articleRepository);
  }

  async getArticles(page: number) {
    return await this.fetchArticlesUseCase.execute(page);
  }
}
