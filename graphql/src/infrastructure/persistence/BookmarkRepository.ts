import { createId } from "@paralleldrive/cuid2";
import {
  createBookmark,
  createBookmarkTag,
  deleteBookmark as deleteBookmarkSql,
  deleteBookmarkTags,
  findBookmarkById,
  findManyBookmarks,
  updateBookmark,
} from "../../generated/prisma/sql.js";
import { prisma } from "../../libs/prisma/client";
import type {
  Bookmark,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "../domain/Bookmark";
import * as tagRepository from "./TagRepository";

type BookmarkQueryResult = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  tag_id: string | null;
  tag_name: string | null;
  tag_created_at: Date | null;
  tag_updated_at: Date | null;
};

const mapBookmarkResults = (results: BookmarkQueryResult[]): Bookmark[] => {
  const bookmarkMap = new Map<string, Bookmark>();

  for (const row of results) {
    if (!bookmarkMap.has(row.id)) {
      bookmarkMap.set(row.id, {
        id: row.id,
        title: row.title,
        url: row.url,
        description: row.description,
        created_at: row.created_at,
        updated_at: row.updated_at,
        tags: [],
      });
    }

    const bookmark = bookmarkMap.get(row.id)!;
    if (
      row.tag_id &&
      row.tag_name &&
      row.tag_created_at &&
      row.tag_updated_at
    ) {
      bookmark.tags!.push({
        id: row.tag_id,
        name: row.tag_name,
        created_at: row.tag_created_at,
        updated_at: row.tag_updated_at,
      });
    }
  }

  return Array.from(bookmarkMap.values());
};

export const findMany = async (): Promise<Bookmark[]> => {
  const results = await prisma.$queryRawTyped(findManyBookmarks());
  return mapBookmarkResults(results);
};

export const findById = async (id: string): Promise<Bookmark | null> => {
  const results = await prisma.$queryRawTyped(findBookmarkById(id));

  if (results.length === 0) {
    return null;
  }

  const bookmarks = mapBookmarkResults(results);
  return bookmarks[0];
};

export const create = async (input: CreateBookmarkInput): Promise<Bookmark> => {
  // First create or find tags
  const tags = input.tagNames
    ? await Promise.all(
        input.tagNames.map((tagName) => tagRepository.findOrCreate(tagName)),
      )
    : [];

  const bookmarkId = createId();

  return await prisma.$transaction(async (tx) => {
    // Create bookmark
    const bookmarkResults = await tx.$queryRawTyped(
      createBookmark(
        bookmarkId,
        input.title,
        input.url,
        input.description || null,
      ),
    );

    // Create tag relationships
    for (const tag of tags) {
      await tx.$queryRawTyped(createBookmarkTag(bookmarkId, tag.id));
    }

    // Fetch the complete bookmark with tags
    const results = await tx.$queryRawTyped(findBookmarkById(bookmarkId));
    const bookmarks = mapBookmarkResults(results);
    return bookmarks[0];
  });
};

export const update = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
  return await prisma.$transaction(async (tx) => {
    // Check if bookmark exists first
    const existingResults = await tx.$queryRawTyped(findBookmarkById(id));
    if (existingResults.length === 0) {
      throw new Error("Bookmark not found");
    }
    const existing = mapBookmarkResults(existingResults)[0];

    // Update bookmark
    const updateResults = await tx.$queryRawTyped(
      updateBookmark(
        id,
        input.title !== undefined ? input.title : existing.title,
        input.url !== undefined ? input.url : existing.url,
        input.description !== undefined
          ? input.description
          : existing.description,
      ),
    );

    // Handle tags if provided
    if (input.tagNames !== undefined) {
      const tags = await Promise.all(
        input.tagNames.map((tagName) => tagRepository.findOrCreate(tagName)),
      );

      // Remove existing tag relationships
      await tx.$queryRawTyped(deleteBookmarkTags(id));

      // Create new tag relationships
      for (const tag of tags) {
        await tx.$queryRawTyped(createBookmarkTag(id, tag.id));
      }
    }

    // Fetch the complete bookmark with tags
    const results = await tx.$queryRawTyped(findBookmarkById(id));
    const bookmarks = mapBookmarkResults(results);
    return bookmarks[0];
  });
};

export const deleteBookmark = async (id: string): Promise<void> => {
  // Check if bookmark exists first
  const existing = await findById(id);
  if (!existing) {
    throw new Error("Bookmark not found");
  }

  await prisma.$queryRawTyped(deleteBookmarkSql(id));
};
