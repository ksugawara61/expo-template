import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export type { CreateBookmarkInput };

export const createBookmarkUseCase = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  return bookmarkRepository.create(input);
};
