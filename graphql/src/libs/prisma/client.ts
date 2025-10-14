import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "../../generated/prisma/client";

const adapter =
  process.env.TURSO_DATABASE_URL &&
  new PrismaLibSQL({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
export const prisma = adapter
  ? new PrismaClient({ adapter })
  : new PrismaClient();
