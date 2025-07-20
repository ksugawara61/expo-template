import { fetchArticles } from "./domains/articles";

export const server = {
  Query: {
    articles: async (page: number) => await fetchArticles(page),
  },
  Mutation: {},
};
