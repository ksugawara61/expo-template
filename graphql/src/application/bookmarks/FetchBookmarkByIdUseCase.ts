import type { Bookmark } from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export const fetchBookmarkByIdUseCase = async (
  id: string,
): Promise<Bookmark | null> => {
  try {
    return await bookmarkRepository.findById(id);
  } catch (error) {
    throw new Error(
      `Failed to fetch bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
