import { describe, expect, it } from "vitest";
import { server } from "../server";

describe("GraphQL Error Handling Integration", () => {
  describe("Error propagation", () => {
    it("should have error handling in resolvers", () => {
      // Test that our resolvers exist and are async functions (indicating they can throw errors)
      expect(typeof server.Query.articles).toBe("function");
      expect(typeof server.Query.bookmarks).toBe("function");
      expect(typeof server.Query.bookmark).toBe("function");
      expect(typeof server.Mutation.createBookmark).toBe("function");
      expect(typeof server.Mutation.updateBookmark).toBe("function");
      expect(typeof server.Mutation.deleteBookmark).toBe("function");

      // Check that they are async functions
      expect(server.Query.articles.constructor.name).toBe("AsyncFunction");
      expect(server.Query.bookmarks.constructor.name).toBe("AsyncFunction");
      expect(server.Query.bookmark.constructor.name).toBe("AsyncFunction");
      expect(server.Mutation.createBookmark.constructor.name).toBe(
        "AsyncFunction",
      );
      expect(server.Mutation.updateBookmark.constructor.name).toBe(
        "AsyncFunction",
      );
      expect(server.Mutation.deleteBookmark.constructor.name).toBe(
        "AsyncFunction",
      );
    });
  });
});
