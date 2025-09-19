import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export const deleteBookmarkUseCase = async (id: string): Promise<boolean> => {
  try {
    await bookmarkRepository.deleteBookmark(id);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("No record was found")) {
      throw new Error("Bookmark not found");
    }
    throw new Error(
      `Failed to delete bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
