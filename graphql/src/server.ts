import { fetchArticlesUseCase } from "./application/articles/FetchArticlesUseCase";
import { createBookmarkUseCase } from "./application/bookmarks/CreateBookmarkUseCase";
import { deleteBookmarkUseCase } from "./application/bookmarks/DeleteBookmarkUseCase";
import { fetchBookmarkByIdUseCase } from "./application/bookmarks/FetchBookmarkByIdUseCase";
import { fetchBookmarksUseCase } from "./application/bookmarks/FetchBookmarksUseCase";
import { updateBookmarkUseCase } from "./application/bookmarks/UpdateBookmarkUseCase";
import { createTagUseCase } from "./application/tags/CreateTagUseCase";
import { fetchTagsUseCase } from "./application/tags/FetchTagsUseCase";
import { requireAuth } from "./middleware/auth";

export const server = {
  Query: {
    articles: requireAuth(fetchArticlesUseCase),
    bookmarks: requireAuth(fetchBookmarksUseCase),
    bookmark: requireAuth(fetchBookmarkByIdUseCase),
    tags: requireAuth(fetchTagsUseCase),
  },
  Mutation: {
    createBookmark: requireAuth(createBookmarkUseCase),
    updateBookmark: requireAuth(updateBookmarkUseCase),
    deleteBookmark: requireAuth(deleteBookmarkUseCase),
    createTag: requireAuth(createTagUseCase),
  },
};
