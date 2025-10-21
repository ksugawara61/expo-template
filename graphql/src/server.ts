import { fetchArticlesUseCase } from "./application/articles/FetchArticlesUseCase";
import { createBookmarkUseCase } from "./application/bookmarks/CreateBookmarkUseCase";
import { deleteBookmarkUseCase } from "./application/bookmarks/DeleteBookmarkUseCase";
import { fetchBookmarkByIdUseCase } from "./application/bookmarks/FetchBookmarkByIdUseCase";
import { fetchBookmarksUseCase } from "./application/bookmarks/FetchBookmarksUseCase";
import { updateBookmarkUseCase } from "./application/bookmarks/UpdateBookmarkUseCase";
import { createTagUseCase } from "./application/tags/CreateTagUseCase";
import { fetchTagsUseCase } from "./application/tags/FetchTagsUseCase";

export const server = {
  Query: {
    articles: fetchArticlesUseCase,
    bookmarks: fetchBookmarksUseCase,
    bookmark: fetchBookmarkByIdUseCase,
    tags: fetchTagsUseCase,
  },
  Mutation: {
    createBookmark: createBookmarkUseCase,
    updateBookmark: updateBookmarkUseCase,
    deleteBookmark: deleteBookmarkUseCase,
    createTag: createTagUseCase,
  },
};
