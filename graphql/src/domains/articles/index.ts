import { createQiitaApiClient } from "../../libs/openapi/client";

type Tag = {
  name: string;
};

type User = {
  name: string | null;
};

type Article = {
  id: string;
  title: string;
  body: string;
  url: string;
  user: User;
  tags: Tag[];
  created_at: string;
  updated_at: string;
};

export const fetchArticles = async (page: number): Promise<Article[]> => {
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
};
