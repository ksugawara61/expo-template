import type { Bookmark } from "../../../domain/bookmarks/Bookmark";
import * as bookmarkRepository from "../../../infrastructure/persistence/BookmarkRepositoryImpl";

export const fetchBookmarksUseCase = async (): Promise<Bookmark[]> => {
  return bookmarkRepository.findMany();
};
