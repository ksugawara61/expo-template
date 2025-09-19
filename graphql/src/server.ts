import { fetchArticlesUseCase } from "./application/articles/FetchArticlesUseCase";
import {
  createBookmarkUseCase,
  type CreateBookmarkInput,
} from "./application/bookmarks/CreateBookmarkUseCase";
import { deleteBookmarkUseCase } from "./application/bookmarks/DeleteBookmarkUseCase";
import { fetchBookmarkByIdUseCase } from "./application/bookmarks/FetchBookmarkByIdUseCase";
import { fetchBookmarksUseCase } from "./application/bookmarks/FetchBookmarksUseCase";
import {
  updateBookmarkUseCase,
  type UpdateBookmarkInput,
} from "./application/bookmarks/UpdateBookmarkUseCase";

export const server = {
  Query: {
    articles: async (page: number) => await fetchArticlesUseCase(page),
    bookmarks: async () => await fetchBookmarksUseCase(),
    bookmark: async (id: string) => await fetchBookmarkByIdUseCase(id),
  },
  Mutation: {
    createBookmark: async (input: CreateBookmarkInput) =>
      await createBookmarkUseCase(input),
    updateBookmark: async (id: string, input: UpdateBookmarkInput) =>
      await updateBookmarkUseCase(id, input),
    deleteBookmark: async (id: string) => await deleteBookmarkUseCase(id),
  },
};
