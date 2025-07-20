import { fetchArticles } from "./domains/articles";

export const server = {
  Query: {
    hello: () => {
      return "Hello, world!";
    },
    articles: async (page: number) => await fetchArticles(page),
  },
  Mutation: {},
};
