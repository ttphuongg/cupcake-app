export const validateMiddleware = (schema) => {
    return async (req, res, next) => {
        try {
            // Sử dụng schema để validate req.body
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            // Nếu dữ liệu sai, trả về lỗi 400 kèm chi tiết các trường bị lỗi
            res.status(400).json({
                success: false,
                message: 'Dữ liệu đầu vào không hợp lệ',
                errors: error.errors
            });
        }
    };
};
//# sourceMappingURL=validate.middleware.js.map