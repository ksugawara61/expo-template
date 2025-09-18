import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../../domain/bookmarks/Bookmark";
import * as bookmarkRepository from "../../../infrastructure/repositories/BookmarkRepositoryImpl";

export const execute = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  return bookmarkRepository.create(input);
};
