import { describe, expect, it } from "vitest";
import * as bookmarkRepository from "./BookmarkRepository";

describe("BookmarkRepository", () => {
  describe("create", () => {
    it("should create a new bookmark", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
      };

      const result = await bookmarkRepository.create(input);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBe(input.description);
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
      expect(result.created_at.getTime()).toBe(result.updated_at.getTime());
    });

    it("should create a bookmark without description", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
      };

      const result = await bookmarkRepository.create(input);

      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBeNull();
    });
  });

  describe("findMany", () => {
    it("should return empty array when no bookmarks exist", async () => {
      const result = await bookmarkRepository.findMany();
      expect(result).toEqual([]);
    });

    it("should return all bookmarks ordered by created_at desc", async () => {
      const bookmark1 = await bookmarkRepository.create({
        title: "Bookmark 1",
        url: "https://example1.com",
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      const bookmark2 = await bookmarkRepository.create({
        title: "Bookmark 2",
        url: "https://example2.com",
      });

      const result = await bookmarkRepository.findMany();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(bookmark2.id);
      expect(result[1].id).toBe(bookmark1.id);
    });
  });

  describe("findById", () => {
    it("should return bookmark by id", async () => {
      const created = await bookmarkRepository.create({
        title: "Test Bookmark",
        url: "https://example.com",
      });

      const result = await bookmarkRepository.findById(created.id);

      expect(result).toEqual(created);
    });

    it("should return null for non-existent id", async () => {
      const result = await bookmarkRepository.findById("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update existing bookmark", async () => {
      const created = await bookmarkRepository.create({
        title: "Original Title",
        url: "https://example.com",
        description: "Original description",
      });

      const updateInput = {
        title: "Updated Title",
        description: "Updated description",
      };

      const result = await bookmarkRepository.update(created.id, updateInput);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.title).toBe(updateInput.title);
      expect(result?.url).toBe(created.url);
      expect(result?.description).toBe(updateInput.description);
      expect(result?.created_at.getTime()).toBe(created.created_at.getTime());
      expect(result?.updated_at.getTime()).toBeGreaterThanOrEqual(
        created.updated_at.getTime(),
      );
    });

    it("should throw error for non-existent bookmark", async () => {
      await expect(
        bookmarkRepository.update("non-existent-id", {
          title: "Updated Title",
        }),
      ).rejects.toThrow();
    });

    it("should update only provided fields", async () => {
      const created = await bookmarkRepository.create({
        title: "Original Title",
        url: "https://example.com",
        description: "Original description",
      });

      const result = await bookmarkRepository.update(created.id, {
        title: "Updated Title",
      });

      expect(result?.title).toBe("Updated Title");
      expect(result?.url).toBe(created.url);
      expect(result?.description).toBe(created.description);
    });
  });

  describe("deleteBookmark", () => {
    it("should delete existing bookmark", async () => {
      const created = await bookmarkRepository.create({
        title: "Test Bookmark",
        url: "https://example.com",
      });

      await bookmarkRepository.deleteBookmark(created.id);

      const fetched = await bookmarkRepository.findById(created.id);
      expect(fetched).toBeNull();
    });

    it("should throw error for non-existent bookmark", async () => {
      await expect(
        bookmarkRepository.deleteBookmark("non-existent-id"),
      ).rejects.toThrow();
    });
  });

  describe("tags functionality", () => {
    it("should create bookmark with tags", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
        tagNames: ["tag1", "tag2", "tag3"],
      };

      const result = await bookmarkRepository.create(input);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.tags).toHaveLength(3);
      expect(result.tags?.map((tag) => tag.name).sort()).toEqual([
        "tag1",
        "tag2",
        "tag3",
      ]);
    });

    it("should find bookmark with tags", async () => {
      const created = await bookmarkRepository.create({
        title: "Test Bookmark",
        url: "https://example.com",
        tagNames: ["findTag1", "findTag2"],
      });

      const found = await bookmarkRepository.findById(created.id);

      expect(found).not.toBeNull();
      expect(found?.tags).toHaveLength(2);
      expect(found?.tags?.map((tag) => tag.name).sort()).toEqual([
        "findTag1",
        "findTag2",
      ]);
    });

    it("should update bookmark tags", async () => {
      const created = await bookmarkRepository.create({
        title: "Test Bookmark",
        url: "https://example.com",
        tagNames: ["oldTag1", "oldTag2"],
      });

      const updated = await bookmarkRepository.update(created.id, {
        tagNames: ["newTag1", "newTag2", "newTag3"],
      });

      expect(updated.tags).toHaveLength(3);
      expect(updated.tags?.map((tag) => tag.name).sort()).toEqual([
        "newTag1",
        "newTag2",
        "newTag3",
      ]);
    });

    it("should preserve existing tags when updating other fields", async () => {
      const created = await bookmarkRepository.create({
        title: "Original Title",
        url: "https://example.com",
        tagNames: ["preserveTag1", "preserveTag2"],
      });

      const updated = await bookmarkRepository.update(created.id, {
        title: "Updated Title",
      });

      expect(updated.title).toBe("Updated Title");
      expect(updated.tags).toHaveLength(2);
      expect(updated.tags?.map((tag) => tag.name).sort()).toEqual([
        "preserveTag1",
        "preserveTag2",
      ]);
    });

    it("should handle empty tag array", async () => {
      const created = await bookmarkRepository.create({
        title: "Test Bookmark",
        url: "https://example.com",
        tagNames: ["tag1", "tag2"],
      });

      const updated = await bookmarkRepository.update(created.id, {
        tagNames: [],
      });

      expect(updated.tags).toHaveLength(0);
    });

    it("should handle duplicate tag names", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
        tagNames: ["duplicate", "duplicate", "unique"],
      };

      const result = await bookmarkRepository.create(input);

      expect(result.tags).toHaveLength(2);
      expect(result.tags?.map((tag) => tag.name).sort()).toEqual([
        "duplicate",
        "unique",
      ]);
    });
  });
});
