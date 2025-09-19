import type { Bookmark } from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export const fetchBookmarksUseCase = async (): Promise<Bookmark[]> => {
  try {
    return await bookmarkRepository.findMany();
  } catch (error) {
    throw new Error(
      `Failed to fetch bookmarks: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
