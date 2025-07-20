import { describe, expect, it, beforeEach } from "vitest";
import {
  fetchBookmarks,
  fetchBookmarkById,
  createBookmark,
  updateBookmark,
  deleteBookmark,
} from ".";

describe("bookmarks", () => {
  beforeEach(() => {
    // Clear all bookmarks before each test
    const bookmarks = (globalThis as any).__bookmarks__;
    if (bookmarks) {
      bookmarks.clear();
    }
  });

  describe("createBookmark", () => {
    it("should create a new bookmark", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
      };

      const result = await createBookmark(input);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBe(input.description);
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
      expect(result.created_at).toBe(result.updated_at);
    });

    it("should create a bookmark without description", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
      };

      const result = await createBookmark(input);

      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBeUndefined();
    });
  });

  describe("fetchBookmarks", () => {
    it("should return empty array when no bookmarks exist", async () => {
      const result = await fetchBookmarks();
      expect(result).toEqual([]);
    });

    it("should return all bookmarks", async () => {
      const bookmark1 = await createBookmark({
        title: "Bookmark 1",
        url: "https://example1.com",
      });
      const bookmark2 = await createBookmark({
        title: "Bookmark 2",
        url: "https://example2.com",
      });

      const result = await fetchBookmarks();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(bookmark1);
      expect(result).toContainEqual(bookmark2);
    });
  });

  describe("fetchBookmarkById", () => {
    it("should return bookmark by id", async () => {
      const created = await createBookmark({
        title: "Test Bookmark",
        url: "https://example.com",
      });

      const result = await fetchBookmarkById(created.id);

      expect(result).toEqual(created);
    });

    it("should return null for non-existent id", async () => {
      const result = await fetchBookmarkById("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("updateBookmark", () => {
    it("should update existing bookmark", async () => {
      const created = await createBookmark({
        title: "Original Title",
        url: "https://example.com",
        description: "Original description",
      });

      const updateInput = {
        title: "Updated Title",
        description: "Updated description",
      };

      const result = await updateBookmark(created.id, updateInput);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(created.id);
      expect(result!.title).toBe(updateInput.title);
      expect(result!.url).toBe(created.url); // Should remain unchanged
      expect(result!.description).toBe(updateInput.description);
      expect(result!.created_at).toBe(created.created_at);
      expect(result!.updated_at).not.toBe(created.updated_at);
    });

    it("should return null for non-existent bookmark", async () => {
      const result = await updateBookmark("non-existent-id", {
        title: "Updated Title",
      });

      expect(result).toBeNull();
    });

    it("should update only provided fields", async () => {
      const created = await createBookmark({
        title: "Original Title",
        url: "https://example.com",
        description: "Original description",
      });

      const result = await updateBookmark(created.id, {
        title: "Updated Title",
      });

      expect(result!.title).toBe("Updated Title");
      expect(result!.url).toBe(created.url);
      expect(result!.description).toBe(created.description);
    });
  });

  describe("deleteBookmark", () => {
    it("should delete existing bookmark", async () => {
      const created = await createBookmark({
        title: "Test Bookmark",
        url: "https://example.com",
      });

      const result = await deleteBookmark(created.id);

      expect(result).toBe(true);

      const fetched = await fetchBookmarkById(created.id);
      expect(fetched).toBeNull();
    });

    it("should return false for non-existent bookmark", async () => {
      const result = await deleteBookmark("non-existent-id");
      expect(result).toBe(false);
    });
  });
});
