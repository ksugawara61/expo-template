import type { BookmarkRepository } from "../../domain/bookmarks/repositories/BookmarkRepository";
import type { Bookmark, CreateBookmarkInput, UpdateBookmarkInput } from "../../domain/bookmarks/entities";
import { prisma } from "../../libs/prisma/client";

export class BookmarkRepositoryImpl implements BookmarkRepository {
  async findMany(): Promise<Bookmark[]> {
    return await prisma.bookmark.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async findById(id: string): Promise<Bookmark | null> {
    return await prisma.bookmark.findUnique({
      where: { id },
    });
  }

  async create(input: CreateBookmarkInput): Promise<Bookmark> {
    return await prisma.bookmark.create({
      data: {
        title: input.title,
        url: input.url,
        description: input.description,
      },
    });
  }

  async update(id: string, input: UpdateBookmarkInput): Promise<Bookmark | null> {
    try {
      return await prisma.bookmark.update({
        where: { id },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.url !== undefined && { url: input.url }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
        },
      });
    } catch (_error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.bookmark.delete({
        where: { id },
      });
      return true;
    } catch (_error) {
      return false;
    }
  }
}