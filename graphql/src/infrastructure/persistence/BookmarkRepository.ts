import { prisma } from "../../libs/prisma/client";
import type {
  Bookmark,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "../domain/Bookmark";
import * as tagRepository from "./TagRepository";

export const findMany = async (): Promise<Bookmark[]> => {
  const bookmarks = await prisma.bookmark.findMany({
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return bookmarks.map((bookmark) => ({
    id: bookmark.id,
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    created_at: bookmark.created_at,
    updated_at: bookmark.updated_at,
    tags: bookmark.tags.map((bookmarkTag) => ({
      id: bookmarkTag.tag.id,
      name: bookmarkTag.tag.name,
      created_at: bookmarkTag.tag.created_at,
      updated_at: bookmarkTag.tag.updated_at,
    })),
  }));
};

export const findById = async (id: string): Promise<Bookmark | null> => {
  const bookmark = await prisma.bookmark.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!bookmark) {
    return null;
  }

  return {
    id: bookmark.id,
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    created_at: bookmark.created_at,
    updated_at: bookmark.updated_at,
    tags: bookmark.tags.map((bookmarkTag) => ({
      id: bookmarkTag.tag.id,
      name: bookmarkTag.tag.name,
      created_at: bookmarkTag.tag.created_at,
      updated_at: bookmarkTag.tag.updated_at,
    })),
  };
};

export const create = async (input: CreateBookmarkInput): Promise<Bookmark> => {
  // First create or find tags
  const tags = input.tagNames
    ? await Promise.all(
        input.tagNames.map((tagName) => tagRepository.findOrCreate(tagName)),
      )
    : [];

  const bookmark = await prisma.bookmark.create({
    data: {
      title: input.title,
      url: input.url,
      description: input.description,
      tags: {
        create: tags.map((tag) => ({
          tag_id: tag.id,
        })),
      },
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return {
    id: bookmark.id,
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    created_at: bookmark.created_at,
    updated_at: bookmark.updated_at,
    tags: bookmark.tags.map((bookmarkTag) => ({
      id: bookmarkTag.tag.id,
      name: bookmarkTag.tag.name,
      created_at: bookmarkTag.tag.created_at,
      updated_at: bookmarkTag.tag.updated_at,
    })),
  };
};

export const update = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
  // Handle tags if provided
  let tagsData = {};
  if (input.tagNames !== undefined) {
    const tags = await Promise.all(
      input.tagNames.map((tagName) => tagRepository.findOrCreate(tagName)),
    );

    tagsData = {
      tags: {
        deleteMany: {}, // Remove existing relationships
        create: tags.map((tag) => ({
          tag_id: tag.id,
        })),
      },
    };
  }

  const bookmark = await prisma.bookmark.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.url !== undefined && { url: input.url }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...tagsData,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return {
    id: bookmark.id,
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    created_at: bookmark.created_at,
    updated_at: bookmark.updated_at,
    tags: bookmark.tags.map((bookmarkTag) => ({
      id: bookmarkTag.tag.id,
      name: bookmarkTag.tag.name,
      created_at: bookmarkTag.tag.created_at,
      updated_at: bookmarkTag.tag.updated_at,
    })),
  };
};

export const deleteBookmark = async (id: string): Promise<void> => {
  await prisma.bookmark.delete({
    where: { id },
  });
};
