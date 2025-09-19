import { fetchArticlesUseCase } from "./application/use-cases/articles/FetchArticlesUseCase";
import { createBookmarkUseCase } from "./application/use-cases/bookmarks/CreateBookmarkUseCase";
import { deleteBookmarkUseCase } from "./application/use-cases/bookmarks/DeleteBookmarkUseCase";
import { fetchBookmarkByIdUseCase } from "./application/use-cases/bookmarks/FetchBookmarkByIdUseCase";
import { fetchBookmarksUseCase } from "./application/use-cases/bookmarks/FetchBookmarksUseCase";
import { updateBookmarkUseCase } from "./application/use-cases/bookmarks/UpdateBookmarkUseCase";

export const server = {
  Query: {
    articles: async (page: number) => await fetchArticlesUseCase(page),
    bookmarks: async () => await fetchBookmarksUseCase(),
    bookmark: async (id: string) => await fetchBookmarkByIdUseCase(id),
  },
  Mutation: {
    createBookmark: async (input: {
      title: string;
      url: string;
      description?: string;
    }) => await createBookmarkUseCase(input),
    updateBookmark: async (
      id: string,
      input: { title?: string; url?: string; description?: string },
    ) => await updateBookmarkUseCase(id, input),
    deleteBookmark: async (id: string) => await deleteBookmarkUseCase(id),
  },
};
