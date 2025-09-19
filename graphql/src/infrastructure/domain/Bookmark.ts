export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
};

export type CreateBookmarkInput = {
  title: string;
  url: string;
  description?: string;
};

export type UpdateBookmarkInput = {
  title?: string;
  url?: string;
  description?: string;
};
