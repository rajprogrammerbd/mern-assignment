/* eslint-disable @typescript-eslint/no-explicit-any */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: any[];

  /**
   * Creates a new API Error
   * @param statusCode HTTP status code
   * @param message Error message
   * @param errors Optional array of validation errors or detailed errors
   * @param isOperational Is this a known operational error (vs programming error)?
   */
  constructor(
    statusCode: number,
    message: string,
    errors?: any[],
    isOperational: boolean = true
  ) {
    super(message);

    // Set the prototype explicitly (for TypeScript)
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Capture stack trace (excluding constructor call from trace)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Log the error creation (optional)
    if (process.env.NODE_ENV === 'development') {
      console.error(this);
    }
  }

  /**
   * Creates a 400 Bad Request error
   * @param message Error message
   * @param errors Optional validation errors
   */
  static badRequest(message: string, errors?: any[]) {
    return new ApiError(400, message, errors);
  }

  /**
   * Creates a 401 Unauthorized error
   * @param message Error message
   */
  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(401, message);
  }

  /**
   * Creates a 403 Forbidden error
   * @param message Error message
   */
  static forbidden(message: string = 'Forbidden') {
    return new ApiError(403, message);
  }

  /**
   * Creates a 404 Not Found error
   * @param message Error message
   */
  static notFound(message: string = 'Not Found') {
    return new ApiError(404, message);
  }

  /**
   * Creates a 422 Unprocessable Entity error (validation errors)
   * @param message Error message
   * @param errors Validation errors
   */
  static unprocessableEntity(message: string, errors: any[]) {
    return new ApiError(422, message, errors);
  }

  /**
   * Creates a 500 Internal Server Error
   * @param message Error message
   */
  static internal(message: string = 'Internal Server Error') {
    return new ApiError(500, message, undefined, false);
  }

  /**
   * Converts error to JSON response format
   */
  toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
      ...(process.env.NODE_ENV === 'development' && {
        stack: this.stack,
        isOperational: this.isOperational,
      }),
    };
  }
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type for error response
 */
export interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: any[];
  stack?: string;
  isOperational?: boolean;
}
