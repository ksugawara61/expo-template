import type {
  Bookmark,
  UpdateBookmarkInput,
} from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export type { UpdateBookmarkInput };

export const updateBookmarkUseCase = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
  return bookmarkRepository.update(id, input);
};
