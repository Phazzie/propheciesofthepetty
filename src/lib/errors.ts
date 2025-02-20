/**
 * Custom error types for application error handling
 */

export type ErrorCode = 
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorMetadata {
  code: ErrorCode;
  severity: ErrorSeverity;
  retry?: boolean;
  retryDelay?: number;
}

export class BaseError extends Error {
  readonly metadata: ErrorMetadata;

  constructor(message: string, metadata: ErrorMetadata) {
    super(message);
    this.name = this.constructor.name;
    this.metadata = metadata;
  }
}

export class AuthError extends BaseError {
  constructor(message: string) {
    super(message, {
      code: 'AUTH_ERROR',
      severity: 'high',
      retry: false
    });
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, {
      code: 'VALIDATION_ERROR',
      severity: 'low',
      retry: false
    });
  }
}

export class NetworkError extends BaseError {
  constructor(message: string) {
    super(message, {
      code: 'NETWORK_ERROR',
      severity: 'medium',
      retry: true,
      retryDelay: 1000
    });
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string, retryDelay: number) {
    super(message, {
      code: 'RATE_LIMIT_ERROR',
      severity: 'medium',
      retry: true,
      retryDelay
    });
  }
}

export class ServerError extends BaseError {
  constructor(message: string) {
    super(message, {
      code: 'SERVER_ERROR',
      severity: 'critical',
      retry: false
    });
  }
}

export const isAppError = (error: unknown): error is BaseError => {
  return error instanceof BaseError;
};

export const handleError = (error: unknown): BaseError => {
  if (isAppError(error)) {
    return error;
  }
  if (error instanceof Error) {
    return new BaseError(error.message, { code: 'UNKNOWN_ERROR', severity: 'medium' });
  }
  return new BaseError('An unknown error occurred', { code: 'UNKNOWN_ERROR', severity: 'medium' });
};