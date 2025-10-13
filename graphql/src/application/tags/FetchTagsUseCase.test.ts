import { describe, expect, it } from "vitest";
import { prisma } from "../../libs/prisma/client";
import { fetchTagsUseCase } from "./FetchTagsUseCase";

describe("FetchTagsUseCase", () => {
  describe("正常系", () => {
    it("should return array of tags", async () => {
      await prisma.tag.createMany({
        data: [
          {
            name: "Frontend",
          },
          {
            name: "Backend",
          },
          {
            name: "Database",
          },
        ],
      });

      const result = await fetchTagsUseCase();

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("created_at");
      expect(result[0]).toHaveProperty("updated_at");

      // Check tags are sorted by name (ascending)
      const tagNames = result.map((tag) => tag.name);
      expect(tagNames).toEqual(["Backend", "Database", "Frontend"]);
    });

    it("should return empty array when no tags exist", async () => {
      const result = await fetchTagsUseCase();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
