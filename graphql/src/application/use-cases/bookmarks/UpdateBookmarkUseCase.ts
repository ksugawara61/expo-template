import type {
  Bookmark,
  UpdateBookmarkInput,
} from "../../../domain/bookmarks/Bookmark";
import * as bookmarkRepository from "../../../infrastructure/persistence/BookmarkRepositoryImpl";

export const updateBookmarkUseCase = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark | null> => {
  return bookmarkRepository.update(id, input);
};
