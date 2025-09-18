export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBookmarkInput {
  title: string;
  url: string;
  description?: string;
}

export interface UpdateBookmarkInput {
  title?: string;
  url?: string;
  description?: string;
}
