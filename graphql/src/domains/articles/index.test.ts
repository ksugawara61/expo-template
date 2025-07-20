import { describe, expect, it } from "vitest";
import { mockServer } from "../../libs/test/mockServer";
import { fetchArticles } from ".";
import { ArticleMocks } from "./index.mocks";

describe("articles", () => {
  it("fetchArticles should return an array of articles", async () => {
    mockServer.use(...ArticleMocks.Success);
    const page = 1;
    const result = await fetchArticles(page);

    expect(result.length).toBeGreaterThan(0);
    for (const article of result) {
      expect(article).toHaveProperty("id");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("body");
      expect(article).toHaveProperty("url");
      expect(article).toHaveProperty("user");
      expect(article).toHaveProperty("tags");
      expect(article).toHaveProperty("created_at");
      expect(article).toHaveProperty("updated_at");
    }
  });
});
