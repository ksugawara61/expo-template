import { fetchArticles } from "./domains/articles";
import {
  createBookmark,
  deleteBookmark,
  fetchBookmarkById,
  fetchBookmarks,
  updateBookmark,
} from "./domains/bookmarks";

export const server = {
  Query: {
    articles: async (page: number) => await fetchArticles(page),
    bookmarks: async () => await fetchBookmarks(),
    bookmark: async (id: string) => await fetchBookmarkById(id),
  },
  Mutation: {
    createBookmark: async (input: {
      title: string;
      url: string;
      description?: string;
    }) => await createBookmark(input),
    updateBookmark: async (
      id: string,
      input: { title?: string; url?: string; description?: string },
    ) => await updateBookmark(id, input),
    deleteBookmark: async (id: string) => await deleteBookmark(id),
  },
};
