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
import {
  type CreateTagInput,
  createTagUseCase,
} from "./application/tags/CreateTagUseCase";
import { fetchTagsUseCase } from "./application/tags/FetchTagsUseCase";

export const server = {
  Query: {
    articles: async (page: number) => await fetchArticlesUseCase(page),
    bookmarks: async () => await fetchBookmarksUseCase(),
    bookmark: async (id: string) => await fetchBookmarkByIdUseCase(id),
    tags: async () => await fetchTagsUseCase(),
  },
  Mutation: {
    createBookmark: async (input: CreateBookmarkInput) =>
      await createBookmarkUseCase(input),
    updateBookmark: async (id: string, input: UpdateBookmarkInput) =>
      await updateBookmarkUseCase(id, input),
    deleteBookmark: async (id: string) => await deleteBookmarkUseCase(id),
    createTag: async (input: CreateTagInput) => await createTagUseCase(input),
  },
};
