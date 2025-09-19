import type { Bookmark } from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import {
  InternalServerError,
  NotFoundError,
} from "../../libs/errors/GraphQLErrors";

export const fetchBookmarkByIdUseCase = async (
  id: string,
): Promise<Bookmark> => {
  try {
    const bookmark = await bookmarkRepository.findById(id);

    if (!bookmark) {
      throw new NotFoundError("Bookmark", id);
    }

    return bookmark;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error; // Re-throw NotFoundError as-is
    }

    console.error("Error fetching bookmark by id:", error);
    throw new InternalServerError("Failed to fetch bookmark");
  }
};
