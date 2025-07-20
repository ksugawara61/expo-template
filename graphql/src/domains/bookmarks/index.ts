type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

type CreateBookmarkInput = {
  title: string;
  url: string;
  description?: string;
};

type UpdateBookmarkInput = {
  title?: string;
  url?: string;
  description?: string;
};

// In-memory storage for demonstration
const bookmarks: Map<string, Bookmark> = new Map();

export const fetchBookmarks = async (): Promise<Bookmark[]> => {
  return Array.from(bookmarks.values());
};

export const fetchBookmarkById = async (id: string): Promise<Bookmark | null> => {
  return bookmarks.get(id) || null;
};

export const createBookmark = async (input: CreateBookmarkInput): Promise<Bookmark> => {
  const id = `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  const bookmark: Bookmark = {
    id,
    title: input.title,
    url: input.url,
    description: input.description,
    created_at: now,
    updated_at: now,
  };
  
  bookmarks.set(id, bookmark);
  return bookmark;
};

export const updateBookmark = async (id: string, input: UpdateBookmarkInput): Promise<Bookmark | null> => {
  const existingBookmark = bookmarks.get(id);
  if (!existingBookmark) {
    return null;
  }
  
  const updatedBookmark: Bookmark = {
    ...existingBookmark,
    ...input,
    updated_at: new Date().toISOString(),
  };
  
  bookmarks.set(id, updatedBookmark);
  return updatedBookmark;
};

export const deleteBookmark = async (id: string): Promise<boolean> => {
  return bookmarks.delete(id);
};