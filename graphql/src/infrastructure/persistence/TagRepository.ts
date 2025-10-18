import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { getDb } from "../../libs/drizzle/client";
import { tags } from "../../libs/drizzle/schema";
import type { CreateTagInput, Tag, UpdateTagInput } from "../domain/Tag";

export const findAll = async (): Promise<Tag[]> => {
  const db = getDb();
  const result = await db.select().from(tags).orderBy(tags.name);

  return result.map((tag) => ({
    id: tag.id,
    name: tag.name,
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
  }));
};

export const findById = async (id: string): Promise<Tag | null> => {
  const db = getDb();
  const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);

  if (result.length === 0) {
    return null;
  }

  const tag = result[0];
  return {
    id: tag.id,
    name: tag.name,
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
  };
};

export const findByName = async (name: string): Promise<Tag | null> => {
  const db = getDb();
  const result = await db
    .select()
    .from(tags)
    .where(eq(tags.name, name))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const tag = result[0];
  return {
    id: tag.id,
    name: tag.name,
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
  };
};

export const create = async (input: CreateTagInput): Promise<Tag> => {
  const db = getDb();
  const [tag] = await db
    .insert(tags)
    .values({ id: createId(), name: input.name })
    .returning();

  return {
    id: tag.id,
    name: tag.name,
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
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
  const db = getDb();
  const updateData = { ...input, updated_at: new Date().toISOString() };
  const [tag] = await db
    .update(tags)
    .set(updateData)
    .where(eq(tags.id, id))
    .returning();

  return {
    id: tag.id,
    name: tag.name,
    created_at: new Date(tag.created_at),
    updated_at: new Date(tag.updated_at),
  };
};

export const remove = async (id: string): Promise<void> => {
  const db = getDb();
  await db.delete(tags).where(eq(tags.id, id));
};
