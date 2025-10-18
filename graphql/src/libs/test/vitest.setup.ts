import { afterAll, afterEach, beforeAll } from "vitest";
import { db } from "../drizzle/client";
import { bookmarks, bookmarkTags, tags } from "../drizzle/schema";
import { mockServer } from "./mockServer";

const clearAllTables = async () => {
  // Clear in reverse order of dependency to avoid foreign key constraint issues
  try {
    await db.delete(bookmarkTags);
  } catch (e) {
    // Ignore if table doesn't exist
  }
  try {
    await db.delete(bookmarks);
  } catch (e) {
    // Ignore if table doesn't exist
  }
  try {
    await db.delete(tags);
  } catch (e) {
    // Ignore if table doesn't exist
  }
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
