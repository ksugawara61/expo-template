import { afterAll, afterEach, beforeAll } from "vitest";
import { prisma } from "../prisma/client";
import { mockServer } from "./mockServer";

beforeAll(async () => {
  mockServer.listen();
});

afterEach(async () => {
  mockServer.resetHandlers();
  await prisma.bookmark.deleteMany();
});

afterAll(async () => {
  mockServer.close();
  await prisma.$disconnect();
});
