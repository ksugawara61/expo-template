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
import { requireAuth } from "./middleware/auth";

export const server = {
  Query: {
    articles: requireAuth(
      async (offset?: number, limit?: number) =>
        await fetchArticlesUseCase(offset, limit),
    ),
    bookmarks: requireAuth(async () => await fetchBookmarksUseCase()),
    bookmark: requireAuth(
      async (id: string) => await fetchBookmarkByIdUseCase(id),
    ),
    tags: requireAuth(async () => await fetchTagsUseCase()),
  },
  Mutation: {
    createBookmark: requireAuth(
      async (input: CreateBookmarkInput) => await createBookmarkUseCase(input),
    ),
    updateBookmark: requireAuth(
      async (id: string, input: UpdateBookmarkInput) =>
        await updateBookmarkUseCase(id, input),
    ),
    deleteBookmark: requireAuth(
      async (id: string) => await deleteBookmarkUseCase(id),
    ),
    createTag: requireAuth(
      async (input: CreateTagInput) => await createTagUseCase(input),
    ),
  },
};
