import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepositoryImpl";

export const createBookmarkUseCase = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  return bookmarkRepository.create(input);
};
