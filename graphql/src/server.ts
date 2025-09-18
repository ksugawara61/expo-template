import { ArticleController, BookmarkController } from "./interface/controllers";

const articleController = new ArticleController();
const bookmarkController = new BookmarkController();

export const server = {
  Query: {
    articles: async (page: number) => await articleController.getArticles(page),
    bookmarks: async () => await bookmarkController.getBookmarks(),
    bookmark: async (id: string) =>
      await bookmarkController.getBookmarkById(id),
  },
  Mutation: {
    createBookmark: async (input: {
      title: string;
      url: string;
      description?: string;
    }) => await bookmarkController.createBookmark(input),
    updateBookmark: async (
      id: string,
      input: { title?: string; url?: string; description?: string },
    ) => await bookmarkController.updateBookmark(id, input),
    deleteBookmark: async (id: string) =>
      await bookmarkController.deleteBookmark(id),
  },
};
