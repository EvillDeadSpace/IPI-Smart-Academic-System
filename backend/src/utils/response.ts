import { Response } from "express";
import { ApiResponse } from "../types/common.types";

export class ResponseUtil {
  /**
   * Send success response
   */
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(res: Response, error: string, statusCode: number = 500) {
    const response: ApiResponse = {
      success: false,
      error,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send validation error
   */
  static validationError(res: Response, message: string) {
    return this.error(res, message, 400);
  }

  /**
   * Send not found error
   */
  static notFound(res: Response, resource: string = "Resource") {
    return this.error(res, `${resource} not found`, 404);
  }

  /**
   * Send unauthorized error
   */
  static unauthorized(res: Response, message: string = "Unauthorized") {
    return this.error(res, message, 401);
  }
}
