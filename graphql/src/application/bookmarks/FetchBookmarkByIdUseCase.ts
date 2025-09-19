import type { Bookmark } from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export const fetchBookmarkByIdUseCase = async (
  id: string,
): Promise<Bookmark | null> => {
  return bookmarkRepository.findById(id);
};
