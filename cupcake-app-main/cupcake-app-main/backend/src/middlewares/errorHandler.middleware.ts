import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi hệ thống nội bộ';

  ApiResponse.error(res, message, statusCode, err.errors);
};
