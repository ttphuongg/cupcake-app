import { otpModel, OtpType } from '../models/index.js';

const generateCode = (): string => {
    if (process.env.MOCK_OTP === 'true') return '123456';
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const otpService = {
    createOTP: async (identifier: string, type: OtpType, userId: number | null = null): Promise<string> => {
        // Xóa OTP cũ cùng loại
        await otpModel.deleteOldCodes(identifier, type);

        const code = generateCode();
        const expiresAt = new Date(
            Date.now() + (parseInt(process.env.OTP_EXPIRES_MINUTES || '5')) * 60 * 1000
        );

        await otpModel.create({
            user_id: userId,
            identifier,
            code,
            type,
            expires_at: expiresAt
        });

        return code;
    },

    verifyOTP: async (identifier: string, code: string, type: OtpType) => {
        const otp = await otpModel.findValid(identifier, code, type);
 
        if (!otp) {
            return { valid: false, message: 'Mã OTP không tồn tại, đã hết hạn hoặc đã được sử dụng' };
        }

        // Đánh dấu là đã sử dụng
        if (otp.id) {
            await otpModel.markUsed(otp.id);
        }

        return { valid: true, otp };
    }
};
