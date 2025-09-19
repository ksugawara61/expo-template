import { afterAll, afterEach, beforeAll } from "vitest";
import { prisma } from "../prisma/client";
import { mockServer } from "./mockServer";

const clearAllTables = async () => {
  const tablenames = await prisma.$queryRaw<
    Array<{ name: string }>
  >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';`;

  for (const { name } of tablenames) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`);
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
  await prisma.$disconnect();
});
