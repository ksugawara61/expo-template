import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepositoryImpl";
import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../infrastructure/domain/Bookmark";

export const createBookmarkUseCase = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  return bookmarkRepository.create(input);
};
