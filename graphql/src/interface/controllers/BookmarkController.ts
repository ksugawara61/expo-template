import {
  FetchBookmarksUseCase,
  FetchBookmarkByIdUseCase,
  CreateBookmarkUseCase,
  UpdateBookmarkUseCase,
  DeleteBookmarkUseCase,
} from "../../application/use-cases/bookmarks";
import { BookmarkRepositoryImpl } from "../../infrastructure/repositories";
import type { CreateBookmarkInput, UpdateBookmarkInput } from "../../domain/bookmarks/entities";

export class BookmarkController {
  private readonly fetchBookmarksUseCase: FetchBookmarksUseCase;
  private readonly fetchBookmarkByIdUseCase: FetchBookmarkByIdUseCase;
  private readonly createBookmarkUseCase: CreateBookmarkUseCase;
  private readonly updateBookmarkUseCase: UpdateBookmarkUseCase;
  private readonly deleteBookmarkUseCase: DeleteBookmarkUseCase;

  constructor() {
    const bookmarkRepository = new BookmarkRepositoryImpl();
    this.fetchBookmarksUseCase = new FetchBookmarksUseCase(bookmarkRepository);
    this.fetchBookmarkByIdUseCase = new FetchBookmarkByIdUseCase(bookmarkRepository);
    this.createBookmarkUseCase = new CreateBookmarkUseCase(bookmarkRepository);
    this.updateBookmarkUseCase = new UpdateBookmarkUseCase(bookmarkRepository);
    this.deleteBookmarkUseCase = new DeleteBookmarkUseCase(bookmarkRepository);
  }

  async getBookmarks() {
    return await this.fetchBookmarksUseCase.execute();
  }

  async getBookmarkById(id: string) {
    return await this.fetchBookmarkByIdUseCase.execute(id);
  }

  async createBookmark(input: CreateBookmarkInput) {
    return await this.createBookmarkUseCase.execute(input);
  }

  async updateBookmark(id: string, input: UpdateBookmarkInput) {
    return await this.updateBookmarkUseCase.execute(id, input);
  }

  async deleteBookmark(id: string) {
    return await this.deleteBookmarkUseCase.execute(id);
  }
}