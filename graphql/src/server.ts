import * as fetchArticlesUseCase from "./application/use-cases/articles/FetchArticlesUseCase";
import * as createBookmarkUseCase from "./application/use-cases/bookmarks/CreateBookmarkUseCase";
import * as deleteBookmarkUseCase from "./application/use-cases/bookmarks/DeleteBookmarkUseCase";
import * as fetchBookmarkByIdUseCase from "./application/use-cases/bookmarks/FetchBookmarkByIdUseCase";
import * as fetchBookmarksUseCase from "./application/use-cases/bookmarks/FetchBookmarksUseCase";
import * as updateBookmarkUseCase from "./application/use-cases/bookmarks/UpdateBookmarkUseCase";

export const server = {
  Query: {
    articles: async (page: number) => await fetchArticlesUseCase.execute(page),
    bookmarks: async () => await fetchBookmarksUseCase.execute(),
    bookmark: async (id: string) => await fetchBookmarkByIdUseCase.execute(id),
  },
  Mutation: {
    createBookmark: async (input: {
      title: string;
      url: string;
      description?: string;
    }) => await createBookmarkUseCase.execute(input),
    updateBookmark: async (
      id: string,
      input: { title?: string; url?: string; description?: string },
    ) => await updateBookmarkUseCase.execute(id, input),
    deleteBookmark: async (id: string) =>
      await deleteBookmarkUseCase.execute(id),
  },
};
