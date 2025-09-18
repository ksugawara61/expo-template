import * as bookmarkRepository from "../../../infrastructure/repositories/BookmarkRepositoryImpl";

export const execute = async (id: string): Promise<boolean> => {
  return bookmarkRepository.deleteBookmark(id);
};
