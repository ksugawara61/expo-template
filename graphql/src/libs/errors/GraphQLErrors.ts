/**
 * Base class for application-specific errors
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Error for when a requested resource is not found
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`;
    super(message, "NOT_FOUND", 404);
  }
}

/**
 * Error for invalid input or bad requests
 */
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, "BAD_REQUEST", 400);
  }
}

/**
 * Error for internal server errors
 */
export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * Error for external service failures
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    const errorMessage = message
      ? `External service '${service}' error: ${message}`
      : `External service '${service}' is unavailable`;
    super(errorMessage, "EXTERNAL_SERVICE_ERROR", 502);
  }
}
