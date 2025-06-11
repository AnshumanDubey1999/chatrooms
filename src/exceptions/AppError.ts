import { Response } from "express";
import { ErrorData, Errors } from "./Errors.js";

export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly field?: string;

    constructor(errorType: Errors) {
      const errorDetails = ErrorData[errorType];
      super(errorDetails.message);
      this.code = errorDetails.code;
      this.field = errorDetails.field;
      this.statusCode = errorDetails.statusCode || 400;
    }

    public sendResponse(res: Response): void {
        res.status(this.statusCode).json({
          error: {
            code: this.code,
            message: this.message,
            field: this.field,
          },
        });
      }
  }