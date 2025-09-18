import type {
  Bookmark,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "../entities";

export interface BookmarkRepository {
  findMany(): Promise<Bookmark[]>;
  findById(id: string): Promise<Bookmark | null>;
  create(input: CreateBookmarkInput): Promise<Bookmark>;
  update(id: string, input: UpdateBookmarkInput): Promise<Bookmark | null>;
  delete(id: string): Promise<boolean>;
}
