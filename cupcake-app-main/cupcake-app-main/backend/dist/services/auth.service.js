import jwt from 'jsonwebtoken';
import { userModel } from '../models/index.js';
import { otpService } from './otp.service.js';
import { mailService } from './mail.service.js';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const authService = {
    register: async (email, phone, password, name, otpMethod = 'email') => {
        // Kiểm tra email đã tồn tại
        const existingByEmail = await userModel.findByEmail(email);
        const targetIdentifier = otpMethod === 'phone' && phone ? phone : email;
        if (existingByEmail) {
            if (existingByEmail.is_verified === 1) {
                throw new Error('Email này đã được sử dụng');
            }
            const userId = existingByEmail.id;
            const otp = await otpService.createOTP(targetIdentifier, 'register', userId);
            if (otpMethod === 'phone' && phone) {
                console.log(`\n📱 [MOCK SMS] Gửi đến SĐT: ${phone}\n📱 [MOCK SMS] Nội dung: Ma OTP xac thuc cua ban la: ${otp}\n`);
            }
            else {
                await mailService.sendOTPEmail(email, otp, 'register');
            }
            return { userId, message: `Mã OTP đã được gửi lại vào ${otpMethod === 'phone' ? 'số điện thoại' : 'email'}.`, targetIdentifier };
        }
        // Kiểm tra SĐT đã tồn tại
        if (phone) {
            const existingByPhone = await userModel.findByPhone(phone);
            if (existingByPhone) {
                if (existingByPhone.is_verified === 1) {
                    throw new Error('Số điện thoại này đã được sử dụng');
                }
            }
        }
        // Tạo user mới với is_verified = 0
        const userId = await userModel.create({ name, email, phone, password, address: null });
        // Gửi OTP xác thực
        const otp = await otpService.createOTP(targetIdentifier, 'register', userId);
        if (otpMethod === 'phone' && phone) {
            console.log(`\n📱 [MOCK SMS] Gửi đến SĐT: ${phone}\n📱 [MOCK SMS] Nội dung: Ma OTP xac thuc cua ban la: ${otp}\n`);
        }
        else {
            await mailService.sendOTPEmail(email, otp, 'register');
        }
        return { userId, message: `Đăng ký thành công. Vui lòng kiểm tra ${otpMethod === 'phone' ? 'tin nhắn' : 'email'} để xác thực tài khoản.`, targetIdentifier };
    },
    verifyRegister: async (identifier, otp) => {
        // identifier có thể là email hoặc phone
        const user = await userModel.findByEmailOrPhone(identifier);
        if (!user || !user.id)
            throw new Error('Tài khoản không tồn tại');
        if (user.is_verified === 1 && user.is_active === 1)
            return { message: 'Tài khoản đã được xác thực trước đó' };
        const verification = await otpService.verifyOTP(identifier, otp, 'register');
        if (!verification.valid)
            throw new Error(verification.message);
        await userModel.activateAccount(user.id);
        return { message: 'Xác thực tài khoản thành công! Bây giờ bạn đã có thể đăng nhập.' };
    },
    login: async (identifier, password) => {
        // Hỗ trợ đăng nhập bằng email hoặc số điện thoại
        const user = await userModel.findByEmailOrPhone(identifier);
        if (!user || !user.id)
            throw new Error('Tài khoản không tồn tại');
        if (user.is_verified === 0) {
            throw new Error('Tài khoản chưa được xác thực. Vui lòng xác thực trước khi đăng nhập.');
        }
        if (user.is_active === 0) {
            throw new Error('Tài khoản của bạn đã bị khóa hoặc vô hiệu hóa.');
        }
        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch)
            throw new Error('Mật khẩu không chính xác');
        // Tạo token phiên đăng nhập
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
        };
    },
    forgotPassword: async (email) => {
        const user = await userModel.findByEmail(email);
        if (!user) {
            throw new Error('Tài khoản không tồn tại');
        }
        // Tạo OTP và gửi email
        const otp = await otpService.createOTP(email, 'forgot-password', user.id);
        await mailService.sendOTPEmail(email, otp, 'forgot-password');
        return { message: 'Mã xác nhận đã được gửi vào email của bạn' };
    },
    resetPassword: async (email, otp, newPassword) => {
        const user = await userModel.findByEmail(email);
        if (!user || !user.id) {
            throw new Error('Tài khoản không tồn tại');
        }
        const verification = await otpService.verifyOTP(email, otp, 'forgot-password');
        if (!verification.valid) {
            throw new Error(verification.message);
        }
        await userModel.updatePassword(user.id, newPassword);
        return { message: 'Đặt lại mật khẩu thành công' };
    },
    logout: async () => {
        // Với JWT, thường việc đăng xuất được xử lý ở client (xóa token khỏi local storage).
        // Nếu có blacklist token thì sẽ xử lý ở đây.
        return { message: 'Đăng xuất thành công' };
    }
};
//# sourceMappingURL=auth.service.js.map