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
    },

    sendResetPasswordEmail: async (to: string, token: string) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        if (process.env.MOCK_OTP === 'true') {
            console.log(`📧 [MOCK EMAIL] Gửi đến: ${to}`);
            console.log(`📧 [MOCK EMAIL] Chủ đề: Đặt lại mật khẩu`);
            console.log(`📧 [MOCK EMAIL] Reset Link: ${resetLink}`);
            return;
        }

        const transporter = createTransporter();
        if (!transporter) return;

        try {
            await transporter.sendMail({
                from: `"Tiệm bánh cupcake 88" <${process.env.MAIL_USER}>`,
                to,
                subject: 'Đặt lại mật khẩu - Tiệm bánh cupcake 88',
                html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 20px auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="background-color: #E8A0BF; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Tiệm bánh cupcake 88</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #fff;">
            <p style="color: #444; font-size: 16px; line-height: 1.6; margin-top: 0;">Chào bạn,</p>
            <p style="color: #666; font-size: 15px; line-height: 1.6;">Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản tại <b>Tiệm bánh cupcake 88</b>. Vui lòng bấm vào liên kết dưới đây để thiết lập mật khẩu mới:</p>
            
            <div style="margin: 35px 0; text-align: center;">
              <a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background-color: #E8A0BF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(232, 160, 191, 0.4);">Đặt lại mật khẩu</a>
            </div>

            <p style="color: #666; font-size: 14px; line-height: 1.6;">Hoặc bạn có thể sao chép liên kết này và dán vào trình duyệt của mình:</p>
            <p style="word-break: break-all; font-size: 13px; color: #888; background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #eee;">${resetLink}</p>

            <p style="color: #ff6b6b; font-size: 14px; text-align: center; margin-top: 25px; margin-bottom: 0;">
              Liên kết này có hiệu lực trong <b>15 phút</b>.<br>
              Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email này.
            </p>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">© 2024 Tiệm bánh cupcake 88. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      `,
            });
            console.log(`✅ [EMAIL] Đã gửi link reset mật khẩu tới: ${to}`);
        } catch (error: any) {
            console.error('❌ [EMAIL ERROR] Lỗi khi gửi mail reset mật khẩu:', error.message);
            throw new Error('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.');
        }
    },

    sendDeleteAccountEmail: async (to: string, token: string) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const deleteLink = `${frontendUrl}/delete-account-confirm?token=${token}`;

        if (process.env.MOCK_OTP === 'true') {
            console.log(`📧 [MOCK EMAIL] Gửi đến: ${to}`);
            console.log(`📧 [MOCK EMAIL] Chủ đề: Xóa tài khoản`);
            console.log(`📧 [MOCK EMAIL] Delete Link: ${deleteLink}`);
            return;
        }

        const transporter = createTransporter();
        if (!transporter) return;

        try {
            await transporter.sendMail({
                from: `"Tiệm bánh cupcake 88" <${process.env.MAIL_USER}>`,
                to,
                subject: 'Xác nhận xóa tài khoản - Tiệm bánh cupcake 88',
                html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 20px auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="background-color: #ef4444; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Cảnh báo xóa tài khoản</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #fff;">
            <p style="color: #444; font-size: 16px; line-height: 1.6; margin-top: 0;">Chào bạn,</p>
            <p style="color: #666; font-size: 15px; line-height: 1.6;">Bạn đã gửi yêu cầu <b>xóa vĩnh viễn</b> tài khoản tại <b>Tiệm bánh cupcake 88</b>. Hãy nhấn vào nút bên dưới để xác nhận thao tác này:</p>
            
            <div style="margin: 35px 0; text-align: center;">
              <a href="${deleteLink}" style="display: inline-block; padding: 15px 30px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);">Xác nhận xóa tài khoản</a>
            </div>

            <p style="color: #666; font-size: 14px; line-height: 1.6;">Hoặc bạn có thể sao chép liên kết này và dán vào trình duyệt của mình:</p>
            <p style="word-break: break-all; font-size: 13px; color: #888; background-color: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px solid #eee;">${deleteLink}</p>

            <p style="color: #ef4444; font-size: 14px; text-align: center; margin-top: 25px; margin-bottom: 0; font-weight: bold;">
              CẢNH BÁO: Hành động này không thể hoàn tác.<br>
              Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
            </p>
            <p style="color: #666; font-size: 13px; text-align: center; margin-top: 10px;">
              Liên kết này có hiệu lực trong <b>15 phút</b>.<br>
              Nếu bạn không yêu cầu xóa tài khoản, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
            </p>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">© 2024 Tiệm bánh cupcake 88. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      `,
            });
            console.log(`✅ [EMAIL] Đã gửi link xóa tài khoản tới: ${to}`);
        } catch (error: any) {
            console.error('❌ [EMAIL ERROR] Lỗi khi gửi mail xóa tài khoản:', error.message);
            throw new Error('Không thể gửi email xác nhận xóa tài khoản. Vui lòng thử lại sau.');
        }
    }
};
