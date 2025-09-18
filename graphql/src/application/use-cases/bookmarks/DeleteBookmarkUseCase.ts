import type { BookmarkRepository } from "../../../domain/bookmarks/repositories/BookmarkRepository";

export class DeleteBookmarkUseCase {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.bookmarkRepository.delete(id);
  }
}