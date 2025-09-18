import type { Bookmark } from "../../../domain/bookmarks/entities";
import type { BookmarkRepository } from "../../../domain/bookmarks/repositories/BookmarkRepository";

export class FetchBookmarksUseCase {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async execute(): Promise<Bookmark[]> {
    return this.bookmarkRepository.findMany();
  }
}
