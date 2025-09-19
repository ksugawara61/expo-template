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
  try {
    return await bookmarkRepository.update(id, input);
  } catch (error) {
    if (error instanceof Error && error.message.includes("No record was found")) {
      throw new Error("Bookmark not found");
    }
    throw new Error(
      `Failed to update bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
