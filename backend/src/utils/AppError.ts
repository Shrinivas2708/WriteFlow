
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;
  public data?: any;

  constructor(statusCode: number, message: string, code?: string, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.data = data;

    // Optional: capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
