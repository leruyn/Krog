import {AppError, AppErrorCode} from './appError';

const ERROR_MESSAGES: Record<AppErrorCode, string> = {
  NETWORK_ERROR: 'Không có kết nối mạng. Vui lòng kiểm tra lại.',
  TIMEOUT: 'Yêu cầu quá thời gian. Thử lại sau.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
  SERVER_ERROR: 'Máy chủ đang gặp sự cố. Thử lại sau.',
  CANCELLED: 'Yêu cầu đã bị hủy.',
  UNKNOWN_ERROR: 'Đã có lỗi xảy ra. Thử lại sau.',
};

export function getUserFacingErrorMessage(
  error: unknown,
  fallback?: string,
): string {
  if (error instanceof AppError) {
    return ERROR_MESSAGES[error.code] ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback ?? ERROR_MESSAGES.UNKNOWN_ERROR;
}
