import nodemailer from 'nodemailer';


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
    sendChangePasswordLinkEmail: async (to: string, resetLink: string) => {
        const subject = 'Xác nhận Đổi mật khẩu - Tiệm bánh cupcake 88';

        if (process.env.MOCK_OTP === 'true') {
            console.log(`📧 [MOCK EMAIL] Gửi đến: ${to}`);
            console.log(`📧 [MOCK EMAIL] Chủ đề: ${subject}`);
            console.log(`📧 [MOCK EMAIL] Link: ${resetLink}`);
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
            <p style="color: #666; font-size: 15px; line-height: 1.6;">Chúng tôi đã nhận được yêu cầu <b>đổi mật khẩu</b> từ bạn. Vui lòng nhấn vào liên kết dưới đây để thiết lập mật khẩu mới (Liên kết này có hiệu lực trong vòng <b>15 phút</b>):</p>
            
            <div style="margin: 35px 0; text-align: center;">
              <a href="${resetLink}" style="display: inline-block; padding: 15px 40px; background-color: #E8A0BF; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(232, 160, 191, 0.4);">Đổi mật khẩu</a>
            </div>

            <p style="color: #aaa; font-size: 13px; margin-top: 25px;">
              Nếu bạn không yêu cầu thay đổi này, hãy yên tâm bỏ qua email này. Mật khẩu của bạn sẽ được giữ an toàn.
            </p>
          </div>
        </div>
      `,
            });
            console.log(`✅ [EMAIL] Đã gửi liên kết đổi mật khẩu tới: ${to}`);
        } catch (error: any) {
            console.error('❌ [EMAIL ERROR] Lỗi khi gửi mail:', error.message);
            throw new Error('Không thể gửi email. Vui lòng kiểm tra lại cấu hình SMTP.');
        }
    },

    sendDeleteAccountLinkEmail: async (to: string, resetLink: string) => {
        const subject = 'Xác nhận Xóa tài khoản - Tiệm bánh cupcake 88';

        if (process.env.MOCK_OTP === 'true') {
            console.log(`📧 [MOCK EMAIL] Gửi đến: ${to}`);
            console.log(`📧 [MOCK EMAIL] Chủ đề: ${subject}`);
            console.log(`📧 [MOCK EMAIL] Link: ${resetLink}`);
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
          <div style="background-color: #ef4444; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Tiệm bánh cupcake 88</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #fff;">
            <p style="color: #444; font-size: 16px; line-height: 1.6; margin-top: 0;">Chào bạn,</p>
            <p style="color: #666; font-size: 15px; line-height: 1.6;">Chúng tôi đã nhận được yêu cầu <b>xóa tài khoản vĩnh viễn</b>. Vui lòng nhấn vào liên kết dưới đây để xác nhận xóa tài khoản (Liên kết này có hiệu lực trong vòng <b>15 phút</b>):</p>
            
            <div style="margin: 35px 0; text-align: center;">
              <a href="${resetLink}" style="display: inline-block; padding: 15px 40px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);">Xác nhận Xóa tài khoản</a>
            </div>

            <p style="color: #aaa; font-size: 13px; margin-top: 25px;">
              Lưu ý: Hành động này không thể hoàn tác. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.
            </p>
          </div>
        </div>
      `,
            });
            console.log(`✅ [EMAIL] Đã gửi liên kết xóa tài khoản tới: ${to}`);
        } catch (error: any) {
            console.error('❌ [EMAIL ERROR] Lỗi khi gửi mail:', error.message);
            throw new Error('Không thể gửi email. Vui lòng kiểm tra lại cấu hình SMTP.');
        }
    },

    sendResetLinkEmail: async (to: string, resetLink: string) => {
        const subject = 'Đặt lại mật khẩu - Tiệm bánh cupcake 88';

        if (process.env.MOCK_OTP === 'true') {
            console.log(`📧 [MOCK EMAIL] Gửi đến: ${to}`);
            console.log(`📧 [MOCK EMAIL] Chủ đề: ${subject}`);
            console.log(`📧 [MOCK EMAIL] Reset Link: ${resetLink}`);
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
            <p style="color: #666; font-size: 15px; line-height: 1.6;">Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu từ bạn. Vui lòng nhấn vào liên kết dưới đây để thực hiện thiết lập mật khẩu mới (Liên kết này có hiệu lực trong vòng <b>15 phút</b>):</p>
            
            <div style="margin: 35px 0; text-align: center;">
              <a href="${resetLink}" style="display: inline-block; padding: 15px 40px; background-color: #E8A0BF; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(232, 160, 191, 0.4);">Đặt lại mật khẩu</a>
            </div>

            <p style="color: #888; font-size: 13px; line-height: 1.6;">
              Nếu nút trên không hoạt động, bạn có thể sao chép liên kết sau và dán vào trình duyệt:<br>
              <a href="${resetLink}" style="color: #E8A0BF; word-break: break-all;">${resetLink}</a>
            </p>

            <p style="color: #aaa; font-size: 13px; margin-top: 25px;">
              Nếu bạn không yêu cầu thay đổi này, hãy yên tâm bỏ qua email này. Mật khẩu của bạn sẽ được giữ an toàn.
            </p>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">© 2024 Tiệm bánh cupcake 88. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      `,
            });
            console.log(`✅ [EMAIL] Đã gửi liên kết khôi phục mật khẩu tới: ${to}`);
        } catch (error: any) {
            console.error('❌ [EMAIL ERROR] Lỗi khi gửi mail:', error.message);
            throw new Error('Không thể gửi email khôi phục mật khẩu. Vui lòng kiểm tra lại cấu hình SMTP hoặc mật khẩu ứng dụng.');
        }
    }
};
