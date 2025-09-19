import type {
  Bookmark,
  UpdateBookmarkInput,
} from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../../libs/errors/GraphQLErrors";

export type { UpdateBookmarkInput };

export const updateBookmarkUseCase = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
  try {
    return await bookmarkRepository.update(id, input);
  } catch (error) {
    console.error("Error updating bookmark:", error);

    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        throw new NotFoundError("Bookmark", id);
      }
      if (error.message.includes("Unique constraint")) {
        throw new BadRequestError("A bookmark with this URL already exists");
      }
      if (
        error.message.includes("Invalid") ||
        error.message.includes("required")
      ) {
        throw new BadRequestError(`Invalid input: ${error.message}`);
      }
    }

    throw new InternalServerError("Failed to update bookmark");
  }
};
