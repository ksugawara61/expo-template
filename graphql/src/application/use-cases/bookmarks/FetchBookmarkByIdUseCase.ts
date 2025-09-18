import type { BookmarkRepository } from "../../../domain/bookmarks/repositories/BookmarkRepository";
import type { Bookmark } from "../../../domain/bookmarks/entities";

export class FetchBookmarkByIdUseCase {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async execute(id: string): Promise<Bookmark | null> {
    return this.bookmarkRepository.findById(id);
  }
}