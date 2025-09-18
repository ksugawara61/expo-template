import type { BookmarkRepository } from "../../../domain/bookmarks/repositories/BookmarkRepository";
import type { Bookmark, CreateBookmarkInput } from "../../../domain/bookmarks/entities";

export class CreateBookmarkUseCase {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async execute(input: CreateBookmarkInput): Promise<Bookmark> {
    return this.bookmarkRepository.create(input);
  }
}