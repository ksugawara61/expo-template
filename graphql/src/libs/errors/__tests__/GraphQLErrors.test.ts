import { describe, expect, it } from "vitest";
import {
  AppError,
  BadRequestError,
  ExternalServiceError,
  InternalServerError,
  NotFoundError,
} from "../GraphQLErrors";

describe("GraphQLErrors", () => {
  describe("AppError", () => {
    it("should create an error with correct properties", () => {
      const error = new AppError("Test message", "TEST_CODE", 400);

      expect(error.message).toBe("Test message");
      expect(error.code).toBe("TEST_CODE");
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe("AppError");
      expect(error instanceof Error).toBe(true);
    });

    it("should use default status code 500", () => {
      const error = new AppError("Test message", "TEST_CODE");

      expect(error.statusCode).toBe(500);
    });
  });

  describe("NotFoundError", () => {
    it("should create error with resource and id", () => {
      const error = new NotFoundError("Bookmark", "123");

      expect(error.message).toBe("Bookmark with id '123' not found");
      expect(error.code).toBe("NOT_FOUND");
      expect(error.statusCode).toBe(404);
    });

    it("should create error with resource only", () => {
      const error = new NotFoundError("User");

      expect(error.message).toBe("User not found");
      expect(error.code).toBe("NOT_FOUND");
      expect(error.statusCode).toBe(404);
    });
  });

  describe("BadRequestError", () => {
    it("should create error with custom message", () => {
      const error = new BadRequestError("Invalid input data");

      expect(error.message).toBe("Invalid input data");
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.statusCode).toBe(400);
    });
  });

  describe("InternalServerError", () => {
    it("should create error with default message", () => {
      const error = new InternalServerError();

      expect(error.message).toBe("Internal server error");
      expect(error.code).toBe("INTERNAL_SERVER_ERROR");
      expect(error.statusCode).toBe(500);
    });

    it("should create error with custom message", () => {
      const error = new InternalServerError("Database error");

      expect(error.message).toBe("Database error");
      expect(error.code).toBe("INTERNAL_SERVER_ERROR");
      expect(error.statusCode).toBe(500);
    });
  });

  describe("ExternalServiceError", () => {
    it("should create error with service name and message", () => {
      const error = new ExternalServiceError(
        "Qiita API",
        "Rate limit exceeded",
      );

      expect(error.message).toBe(
        "External service 'Qiita API' error: Rate limit exceeded",
      );
      expect(error.code).toBe("EXTERNAL_SERVICE_ERROR");
      expect(error.statusCode).toBe(502);
    });

    it("should create error with service name only", () => {
      const error = new ExternalServiceError("Payment Service");

      expect(error.message).toBe(
        "External service 'Payment Service' is unavailable",
      );
      expect(error.code).toBe("EXTERNAL_SERVICE_ERROR");
      expect(error.statusCode).toBe(502);
    });
  });
});
