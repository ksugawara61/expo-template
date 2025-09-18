import type { Article } from "../../domain/articles/entities";
import type { ArticleRepository } from "../../domain/articles/repositories/ArticleRepository";
import { createQiitaApiClient } from "../../libs/openapi/client";

export class ArticleRepositoryImpl implements ArticleRepository {
  async fetchArticles(page: number): Promise<Article[]> {
    const response = await createQiitaApiClient().GET("/items", {
      params: {
        query: {
          page,
        },
      },
    });
    return (
      response.data?.map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        url: item.url,
        user: {
          name: item.user?.name,
        },
        tags: item.tags.map((tag) => ({
          name: tag.name,
        })),
        created_at: item.created_at,
        updated_at: item.updated_at,
      })) || []
    );
  }
}
