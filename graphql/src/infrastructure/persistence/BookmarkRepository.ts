import { prisma } from "../../libs/prisma/client";
import type {
  Bookmark,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "../domain/Bookmark";

export const findMany = async (): Promise<Bookmark[]> => {
  return await prisma.bookmark.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
};

export const findById = async (id: string): Promise<Bookmark | null> => {
  return await prisma.bookmark.findUnique({
    where: { id },
  });
};

export const create = async (input: CreateBookmarkInput): Promise<Bookmark> => {
  return await prisma.bookmark.create({
    data: {
      title: input.title,
      url: input.url,
      description: input.description,
    },
  });
};

export const update = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
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
};

export const deleteBookmark = async (id: string): Promise<void> => {
  await prisma.bookmark.delete({
    where: { id },
  });
};
