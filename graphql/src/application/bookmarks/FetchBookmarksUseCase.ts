import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepositoryImpl";
import type { Bookmark } from "../../infrastructure/domain/Bookmark";

export const fetchBookmarksUseCase = async (): Promise<Bookmark[]> => {
  return bookmarkRepository.findMany();
};
