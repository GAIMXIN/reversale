import httpStatusCodes from '../constants/httpStatusCode.constant';

class CustomError extends Error {
  public statusCode: number;
  public details: unknown | null;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, details: unknown = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.status = this.getStatus(statusCode);
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  private getStatus(statusCode: number): string {
    return httpStatusCodes[statusCode] ?? 'error';
  }

  public setDetails(details: unknown): this {
    this.details = details;
    return this;
  }
}

export default CustomError;
