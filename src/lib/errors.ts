/**
 * Custom error types for application error handling
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
    public severity: 'low' | 'medium' | 'high' = 'medium'
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      severity: this.severity,
      stack: this.stack
    };
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'DATABASE_ERROR', details, 'high');
    this.name = 'DatabaseError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'AUTH_ERROR', details, 'high');
    this.name = 'AuthError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details, 'medium');
    this.name = 'ValidationError';
  }
}

export class AIError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'AI_ERROR', details, 'medium');
    this.name = 'AIError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'NETWORK_ERROR', details, 'high');
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'RATE_LIMIT_ERROR', details, 'high');
    this.name = 'RateLimitError';
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const handleError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', { originalError: error });
  }
  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', { originalError: error });
};