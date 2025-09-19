import { fetchArticlesUseCase } from "./application/articles/FetchArticlesUseCase";
import {
  type CreateBookmarkInput,
  createBookmarkUseCase,
} from "./application/bookmarks/CreateBookmarkUseCase";
import { deleteBookmarkUseCase } from "./application/bookmarks/DeleteBookmarkUseCase";
import { fetchBookmarkByIdUseCase } from "./application/bookmarks/FetchBookmarkByIdUseCase";
import { fetchBookmarksUseCase } from "./application/bookmarks/FetchBookmarksUseCase";
import {
  type UpdateBookmarkInput,
  updateBookmarkUseCase,
} from "./application/bookmarks/UpdateBookmarkUseCase";

export const server = {
  Query: {
    articles: async (page: number) => {
      try {
        return await fetchArticlesUseCase(page);
      } catch (error) {
        throw new Error(
          `Failed to fetch articles: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    bookmarks: async () => {
      try {
        return await fetchBookmarksUseCase();
      } catch (error) {
        throw new Error(
          `Failed to fetch bookmarks: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    bookmark: async (id: string) => {
      try {
        return await fetchBookmarkByIdUseCase(id);
      } catch (error) {
        throw new Error(
          `Failed to fetch bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
  },
  Mutation: {
    createBookmark: async (input: CreateBookmarkInput) => {
      try {
        return await createBookmarkUseCase(input);
      } catch (error) {
        throw new Error(
          `Failed to create bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    updateBookmark: async (id: string, input: UpdateBookmarkInput) => {
      try {
        return await updateBookmarkUseCase(id, input);
      } catch (error) {
        throw new Error(
          `Failed to update bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    deleteBookmark: async (id: string) => {
      try {
        return await deleteBookmarkUseCase(id);
      } catch (error) {
        throw new Error(
          `Failed to delete bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
  },
};
