export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'CANCELLED'
  | 'UNKNOWN_ERROR';

type AppErrorParams = {
  code: AppErrorCode;
  message: string;
  status?: number;
  details?: unknown;
  source?: 'api' | 'business' | 'ui';
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status?: number;
  readonly details?: unknown;
  readonly source?: 'api' | 'business' | 'ui';

  constructor({code, message, status, details, source}: AppErrorParams) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.source = source;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown, fallback = 'Đã có lỗi xảy ra'): string {
  if (isAppError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
