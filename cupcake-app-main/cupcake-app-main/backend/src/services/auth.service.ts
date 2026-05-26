import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userModel } from '../models/index.js';
import { otpService } from './otp.service.js';
import { mailService } from './mail.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const authService = {
    register: async (email: string, phone: string | null, password: string, name: string) => {
        // Kiểm tra email đã tồn tại
        const existingByEmail = await userModel.findByEmail(email);
        if (existingByEmail) {
            throw new Error('Email này đã được sử dụng');
        }

        // Kiểm tra SĐT đã tồn tại
        if (phone) {
            const existingByPhone = await userModel.findByPhone(phone);
            if (existingByPhone) {
                throw new Error('Số điện thoại này đã được sử dụng');
            }
        }

        // Tạo user mới (Tự động kích hoạt is_active = 1, is_verified = 1)
        const userId = await userModel.create({ name, email, phone, password, address: null });

        return { userId, message: 'Đăng ký tài khoản thành công! Bây giờ bạn đã có thể đăng nhập.' };
    },

    verifyRegister: async (identifier: string, otp: string) => {
        // identifier có thể là email hoặc phone
        const user = await userModel.findByEmailOrPhone(identifier);
        if (!user || !user.id) throw new Error('Tài khoản không tồn tại');

        if (user.is_verified === 1 && user.is_active === 1) return { message: 'Tài khoản đã được xác thực trước đó' };

        const verification = await otpService.verifyOTP(identifier, otp, 'register');
        if (!verification.valid) throw new Error(verification.message);

        await userModel.activateAccount(user.id);
        return { message: 'Xác thực tài khoản thành công! Bây giờ bạn đã có thể đăng nhập.' };
    },

    login: async (identifier: string, password: string) => {
        // Hỗ trợ đăng nhập bằng email hoặc số điện thoại
        const user = await userModel.findByEmailOrPhone(identifier);
        if (!user || !user.id) throw new Error('Tài khoản không tồn tại');

        if (user.is_active === 0) {
            throw new Error('Tài khoản của bạn đã bị khóa hoặc vô hiệu hóa.');
        }

        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch) throw new Error('Mật khẩu không chính xác');

        // Tạo token phiên đăng nhập
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as any }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar_url: user.avatar_url,
            }
        };
    },

    forgotPassword: async (email: string) => {
        const user = await userModel.findByEmail(email);
        if (!user || !user.id) {
            throw new Error('Tài khoản không tồn tại');
        }

        // Quy tắc: Chỉ cho phép một tài khoản yêu cầu gửi Reset Link 1 lần trong vòng 1 phút.
        if (user.last_reset_request_at) {
            const diffMs = Date.now() - new Date(user.last_reset_request_at).getTime();
            if (diffMs < 60 * 1000) { // 1 phút = 60000ms
                const secondsLeft = Math.ceil((60 * 1000 - diffMs) / 1000);
                throw new Error(`Vui lòng đợi ${secondsLeft} giây trước khi gửi yêu cầu tiếp theo.`);
            }
        }

        // Tạo Token ngẫu nhiên (dài, ngẫu nhiên và khó đoán)
        const token = crypto.randomBytes(32).toString('hex');
        
        // 2. Có thời gian sống ngắn: Nếu sau 15 phút khách không bấm vào link, link đó phải bị vô hiệu hóa.
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
        const now = new Date();

        // 3. Mỗi lần bấm quên mật khẩu là 1 token mới: Token cũ lập tức bị hủy nếu khách bấm gửi yêu cầu lần thứ 2.
        // Điều này được giải quyết tự động bằng việc UPDATE ghi đè reset_token mới vào database.
        await userModel.updateResetToken(user.id, token, expiresAt, now);

        // Gửi email chứa Reset Link
        await mailService.sendResetPasswordEmail(email, token);

        return { message: 'Liên kết đặt lại mật khẩu đã được gửi vào email của bạn. Vui lòng kiểm tra hộp thư!' };
    },

    verifyResetToken: async (token: string) => {
        if (!token) {
            throw new Error('Mã Token không hợp lệ');
        }

        const user = await userModel.findByResetToken(token);
        if (!user) {
            throw new Error('Mã Token không tồn tại hoặc đã bị sử dụng.');
        }

        // 2. Kiểm tra xem Token còn hạn không (thời gian sống 15 phút)
        if (!user.reset_token_expires || new Date(user.reset_token_expires).getTime() < Date.now()) {
            throw new Error('Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.');
        }

        return { valid: true, email: user.email, message: 'Token hợp lệ' };
    },

    resetPassword: async (token: string, newPassword: string) => {
        if (!token) {
            throw new Error('Mã Token không hợp lệ');
        }

        const user = await userModel.findByResetToken(token);
        if (!user || !user.id) {
            throw new Error('Mã Token không tồn tại hoặc đã bị sử dụng.');
        }

        // 2. Kiểm tra xem Token còn hạn không
        if (!user.reset_token_expires || new Date(user.reset_token_expires).getTime() < Date.now()) {
            throw new Error('Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.');
        }

        // 1. Dùng 1 lần: Ngay sau khi khách đổi mật khẩu thành công, bạn phải xóa Token đó trong DB (chuyển reset_token = NULL)
        // Việc xóa token được xử lý bên trong userModel.updatePassword
        await userModel.updatePassword(user.id, newPassword);

        return { message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' };
    },

    logout: async () => {
        // Với JWT, thường việc đăng xuất được xử lý ở client (xóa token khỏi local storage).
        // Nếu có blacklist token thì sẽ xử lý ở đây.
        return { message: 'Đăng xuất thành công' };
    }
};
