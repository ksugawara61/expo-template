import type {
  Bookmark,
  UpdateBookmarkInput,
} from "../../../domain/bookmarks/entities";
import type { BookmarkRepository } from "../../../domain/bookmarks/repositories/BookmarkRepository";

export class UpdateBookmarkUseCase {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async execute(
    id: string,
    input: UpdateBookmarkInput,
  ): Promise<Bookmark | null> {
    return this.bookmarkRepository.update(id, input);
  }
}
