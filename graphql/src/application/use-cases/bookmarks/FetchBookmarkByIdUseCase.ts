import type { Bookmark } from "../../../domain/bookmarks/Bookmark";
import * as bookmarkRepository from "../../../infrastructure/repositories/BookmarkRepositoryImpl";

export const execute = async (id: string): Promise<Bookmark | null> => {
  return bookmarkRepository.findById(id);
};
