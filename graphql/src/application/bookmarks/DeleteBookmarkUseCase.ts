import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import {
  InternalServerError,
  NotFoundError,
} from "../../libs/errors/GraphQLErrors";

export const deleteBookmarkUseCase = async (id: string): Promise<boolean> => {
  try {
    await bookmarkRepository.deleteBookmark(id);
    return true;
  } catch (error) {
    console.error("Error deleting bookmark:", error);

    if (error instanceof Error) {
      if (error.message.includes("Record to delete does not exist")) {
        throw new NotFoundError("Bookmark", id);
      }
    }

    throw new InternalServerError("Failed to delete bookmark");
  }
};
