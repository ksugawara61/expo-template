import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export const deleteBookmarkUseCase = async (id: string): Promise<boolean> => {
  return bookmarkRepository.deleteBookmark(id);
};
