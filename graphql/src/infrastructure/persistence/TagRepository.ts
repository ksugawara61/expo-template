import { createId } from "@paralleldrive/cuid2";
import {
  createTag,
  deleteTag,
  findAllTags,
  findTagById,
  findTagByName,
  updateTag,
} from "../../generated/prisma/sql.js";
import { prisma } from "../../libs/prisma/client";
import type { CreateTagInput, Tag, UpdateTagInput } from "../domain/Tag";

export const findAll = async (): Promise<Tag[]> => {
  const tags = await prisma.$queryRawTyped(findAllTags());

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    created_at: tag.created_at,
    updated_at: tag.updated_at,
  }));
};

export const findById = async (id: string): Promise<Tag | null> => {
  const tags = await prisma.$queryRawTyped(findTagById(id));
  const tag = tags[0];

  if (!tag) {
    return null;
  }

  return {
    id: tag.id,
    name: tag.name,
    created_at: tag.created_at,
    updated_at: tag.updated_at,
  };
};

export const findByName = async (name: string): Promise<Tag | null> => {
  const tags = await prisma.$queryRawTyped(findTagByName(name));
  const tag = tags[0];

  if (!tag) {
    return null;
  }

  return {
    id: tag.id,
    name: tag.name,
    created_at: tag.created_at,
    updated_at: tag.updated_at,
  };
};

export const create = async (input: CreateTagInput): Promise<Tag> => {
  const id = createId();
  const tags = await prisma.$queryRawTyped(createTag(id, input.name));
  const tag = tags[0];

  return {
    id: tag.id,
    name: tag.name,
    created_at: tag.created_at,
    updated_at: tag.updated_at,
  };
};

export const findOrCreate = async (name: string): Promise<Tag> => {
  const existingTag = await findByName(name);
  if (existingTag) {
    return existingTag;
  }

  return await create({ name });
};

export const update = async (
  id: string,
  input: UpdateTagInput,
): Promise<Tag> => {
  const tags = await prisma.$queryRawTyped(updateTag(id, input.name || null));
  const tag = tags[0];

  return {
    id: tag.id,
    name: tag.name,
    created_at: tag.created_at,
    updated_at: tag.updated_at,
  };
};

export const remove = async (id: string): Promise<void> => {
  await prisma.$queryRawTyped(deleteTag(id));
};
