import nodemailer from 'nodemailer';
import { OtpType } from '../models/index.js';

const createTransporter = () => {
    if (process.env.MOCK_OTP === 'true') return null;

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // sử dụng SSL
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        connectionTimeout: 10000, // 10 giây
    });
};

export const mailService = {
    sendOTPEmail: async (to: string, otp: string, type: OtpType) => {
        const subjects: Record<OtpType, string> = {
            'register': 'Xác thực đăng ký tài khoản',
            'login': 'Mã OTP đăng nhập',
            'update-profile': 'Xác thực cập nhật thông tin',
            'change-password': 'Xác thực đổi mật khẩu',
            'delete-account': 'Xác thực xóa tài khoản',
            'forgot-password': 'Đặt lại mật khẩu',
        };

        const subject = subjects[type] || 'Mã OTP của bạn';

        if (process.env.MOCK_OTP === 'true') {
            console.log(`📧 [MOCK EMAIL] Gửi đến: ${to}`);
            console.log(`📧 [MOCK EMAIL] Chủ đề: ${subject}`);
            console.log(`📧 [MOCK EMAIL] Mã OTP: ${otp}`);
            return;
        }

        const transporter = createTransporter();
        if (!transporter) return;

        try {
            await transporter.sendMail({
                from: `"Tiệm bánh cupcake 88" <${process.env.MAIL_USER}>`,
                to,
                subject,
                html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 20px auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="background-color: #E8A0BF; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Tiệm bánh cupcake 88</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #fff;">
            <p style="color: #444; font-size: 16px; line-height: 1.6; margin-top: 0;">Chào bạn,</p>
            <p style="color: #666; font-size: 15px; line-height: 1.6;">Bạn đang thực hiện thao tác <b>${subject.toLowerCase()}</b> tại <b>Tiệm bánh cupcake 88</b>. Vui lòng sử dụng mã OTP dưới đây để hoàn tất:</p>
            
            <div style="margin: 35px 0; text-align: center;">
              <div style="display: inline-block; padding: 15px 40px; background-color: #FDF4F5; border: 2px dashed #E8A0BF; border-radius: 10px;">
                <span style="font-size: 32px; font-weight: bold; color: #E8A0BF; letter-spacing: 10px; font-family: monospace;">${otp}</span>
              </div>
            </div>

            <p style="color: #888; font-size: 14px; text-align: center; margin-bottom: 0;">
              Mã này có hiệu lực trong <b>${process.env.OTP_EXPIRES_MINUTES || 5} phút</b>.<br>
              Vì lý do bảo mật, tuyệt đối không chia sẻ mã này với bất kỳ ai.
            </p>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">© 2024 Tiệm bánh cupcake 88. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      `,
            });
            console.log(`✅ [EMAIL] Đã gửi mã OTP tới: ${to}`);
        } catch (error: any) {
            console.error('❌ [EMAIL ERROR] Lỗi khi gửi mail:', error.message);
            throw new Error('Không thể gửi email OTP. Vui lòng kiểm tra lại cấu hình SMTP hoặc mật khẩu ứng dụng.');
        }
    }
};
