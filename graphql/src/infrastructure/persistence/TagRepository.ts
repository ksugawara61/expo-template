import { prisma } from "../../libs/prisma/client";
import type { CreateTagInput, Tag, UpdateTagInput } from "../domain/Tag";

export const findAll = async (): Promise<Tag[]> => {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    created_at: tag.created_at,
    updated_at: tag.updated_at,
  }));
};

export const findById = async (id: string): Promise<Tag | null> => {
  const tag = await prisma.tag.findUnique({
    where: { id },
  });

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
  const tag = await prisma.tag.findUnique({
    where: { name },
  });

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
  const tag = await prisma.tag.create({
    data: {
      name: input.name,
    },
  });

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
  const tag = await prisma.tag.update({
    where: { id },
    data: input,
  });

  return {
    id: tag.id,
    name: tag.name,
    created_at: tag.created_at,
    updated_at: tag.updated_at,
  };
};

export const remove = async (id: string): Promise<void> => {
  await prisma.tag.delete({
    where: { id },
  });
};
