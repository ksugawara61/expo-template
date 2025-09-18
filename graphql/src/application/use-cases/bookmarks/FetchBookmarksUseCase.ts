import type { Bookmark } from "../../../domain/bookmarks/Bookmark";
import * as bookmarkRepository from "../../../infrastructure/repositories/BookmarkRepositoryImpl";

export const execute = async (): Promise<Bookmark[]> => {
  return bookmarkRepository.findMany();
};
