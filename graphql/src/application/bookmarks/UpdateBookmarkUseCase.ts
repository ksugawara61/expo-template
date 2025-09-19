import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepositoryImpl";
import type {
  Bookmark,
  UpdateBookmarkInput,
} from "../../infrastructure/domain/Bookmark";

export const updateBookmarkUseCase = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark | null> => {
  return bookmarkRepository.update(id, input);
};
