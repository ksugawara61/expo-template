import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepositoryImpl";
import type { Bookmark } from "../../infrastructure/domain/Bookmark";

export const fetchBookmarkByIdUseCase = async (
  id: string,
): Promise<Bookmark | null> => {
  return bookmarkRepository.findById(id);
};
