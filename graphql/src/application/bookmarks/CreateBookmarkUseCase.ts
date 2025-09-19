import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import {
  BadRequestError,
  InternalServerError,
} from "../../libs/errors/GraphQLErrors";

export type { CreateBookmarkInput };

export const createBookmarkUseCase = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  try {
    return await bookmarkRepository.create(input);
  } catch (error) {
    console.error("Error creating bookmark:", error);

    // Check if it's a Prisma validation error
    if (error instanceof Error) {
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

    throw new InternalServerError("Failed to create bookmark");
  }
};
