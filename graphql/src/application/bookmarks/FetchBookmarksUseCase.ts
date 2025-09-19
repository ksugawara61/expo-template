import type { Bookmark } from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export const fetchBookmarksUseCase = async (): Promise<Bookmark[]> => {
  return bookmarkRepository.findMany();
};
