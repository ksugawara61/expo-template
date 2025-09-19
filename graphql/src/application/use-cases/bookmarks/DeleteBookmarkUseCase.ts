import * as bookmarkRepository from "../../../infrastructure/persistence/BookmarkRepositoryImpl";

export const deleteBookmarkUseCase = async (id: string): Promise<boolean> => {
  return bookmarkRepository.deleteBookmark(id);
};
