import type { Bookmark } from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import { InternalServerError } from "../../libs/errors/GraphQLErrors";

export const fetchBookmarksUseCase = async (): Promise<Bookmark[]> => {
  try {
    return await bookmarkRepository.findMany();
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw new InternalServerError("Failed to fetch bookmarks");
  }
};
