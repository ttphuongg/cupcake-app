import { ApiResponse } from '../utils/ApiResponse.js';
export const errorHandler = (err, req, res, next) => {
    console.error('[Error]:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Lỗi hệ thống nội bộ';
    ApiResponse.error(res, message, statusCode, err.errors);
};
//# sourceMappingURL=errorHandler.middleware.js.map