import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export type { CreateBookmarkInput };

export const createBookmarkUseCase = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  try {
    return await bookmarkRepository.create(input);
  } catch (error) {
    throw new Error(
      `Failed to create bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
