import type { BookmarkRepository } from "../../../domain/bookmarks/repositories/BookmarkRepository";
import type { Bookmark } from "../../../domain/bookmarks/entities";

export class FetchBookmarksUseCase {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async execute(): Promise<Bookmark[]> {
    return this.bookmarkRepository.findMany();
  }
}