import type { Bookmark } from "../../../domain/bookmarks/Bookmark";
import * as bookmarkRepository from "../../../infrastructure/persistence/BookmarkRepositoryImpl";

export const fetchBookmarkByIdUseCase = async (
  id: string,
): Promise<Bookmark | null> => {
  return bookmarkRepository.findById(id);
};
