import { prisma } from "../../libs/prisma/client";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
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

export const fetchBookmarks = async (): Promise<Bookmark[]> => {
  return await prisma.bookmark.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
};

export const fetchBookmarkById = async (
  id: string,
): Promise<Bookmark | null> => {
  return await prisma.bookmark.findUnique({
    where: { id },
  });
};

export const createBookmark = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  return await prisma.bookmark.create({
    data: {
      title: input.title,
      url: input.url,
      description: input.description,
    },
  });
};

export const updateBookmark = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark | null> => {
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
    // Record not found
    return null;
  }
};

export const deleteBookmark = async (id: string): Promise<boolean> => {
  try {
    await prisma.bookmark.delete({
      where: { id },
    });
    return true;
  } catch (_error) {
    // Record not found
    return false;
  }
};
