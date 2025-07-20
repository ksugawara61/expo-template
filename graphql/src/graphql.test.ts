import { describe, expect, it } from "vitest";
import { graphql } from "./graphql";

describe("GraphQL Resolvers", () => {
  describe("Query", () => {
    describe("hello", () => {
      it("should return 'Hello, world!'", () => {
        const result = graphql.Query.hello();
        expect(result).toBe("Hello, world!");
      });

      it("should always return a string", () => {
        const result = graphql.Query.hello();
        expect(typeof result).toBe("string");
      });
    });
  });

  describe("Mutation", () => {
    it("should be an empty object", () => {
      expect(graphql.Mutation).toEqual({});
    });
  });
});