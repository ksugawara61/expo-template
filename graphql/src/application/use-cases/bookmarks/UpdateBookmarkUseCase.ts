import type {
  Bookmark,
  UpdateBookmarkInput,
} from "../../../domain/bookmarks/Bookmark";
import * as bookmarkRepository from "../../../infrastructure/repositories/BookmarkRepositoryImpl";

export const execute = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark | null> => {
  return bookmarkRepository.update(id, input);
};
