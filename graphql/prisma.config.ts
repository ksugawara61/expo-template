import path from "node:path";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { defineConfig } from "prisma/config";

import "dotenv/config";

const adapter = process.env.TURSO_DATABASE_URL
  ? () => {
      if (!process.env.TURSO_DATABASE_URL) {
        throw new Error("TURSO_DATABASE_URL is not set");
      }
      return new PrismaLibSQL({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
        // ref: https://www.prisma.io/docs/orm/overview/databases/turso#3-set-up-prisma-config-file
        // biome-ignore lint/suspicious/noExplicitAny: 公式ドキュメント通り設定しているが型エラーになるため
      }) as any;
    }
  : undefined;

export default defineConfig({
  experimental: {
    adapter: true,
  },
  schema: path.join("prisma", "schema.prisma"),
  adapter,
});
