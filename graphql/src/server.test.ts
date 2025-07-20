import { describe, expect, it } from "vitest";
import { server } from "./server";

describe("GraphQL Resolvers", () => {
  describe("Query", () => {
    describe("hello", () => {
      it("should return 'Hello, world!'", () => {
        const result = server.Query.hello();
        expect(result).toBe("Hello, world!");
      });

      it("should always return a string", () => {
        const result = server.Query.hello();
        expect(typeof result).toBe("string");
      });
    });
  });

  describe("Mutation", () => {
    it("should be an empty object", () => {
      expect(server.Mutation).toEqual({});
    });
  });
});
