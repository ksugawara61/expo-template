export type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string;
  created_at: string;
  updated_at: string;
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
