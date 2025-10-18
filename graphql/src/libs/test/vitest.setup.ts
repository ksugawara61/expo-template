import { afterAll, afterEach, beforeAll } from "vitest";
import { db } from "../drizzle/client";
import { bookmarks, bookmarkTags, tags } from "../drizzle/schema";
import { mockServer } from "./mockServer";

const clearAllTables = async () => {
  await db.delete(bookmarkTags);
  await db.delete(bookmarks);
  await db.delete(tags);
};

beforeAll(async () => {
  mockServer.listen();
});

afterEach(async () => {
  mockServer.resetHandlers();
  await clearAllTables();
});

afterAll(async () => {
  mockServer.close();
});
