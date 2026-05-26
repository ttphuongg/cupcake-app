import { orderModel } from '../models/index.js';
import crypto from 'crypto';

export const paymentService = {
    // Gọi khi khách chọn thanh toán online lúc đặt hàng
    processPayment: async (orderId: number, method: 'MOMO' | 'BANKING') => {
        const order = await orderModel.findById(orderId);
        if (!order) {
            throw new Error('Đơn hàng không tồn tại');
        }

        if (order.payment_status === 'PAID') {
            throw new Error('Đơn hàng này đã được thanh toán');
        }

        // Tạo Request kết nối với cổng thanh toán (Giả lập MoMo/VNPay/ZaloPay)
        // Thực tế: Call Axios tới endpoint của MoMo để lấy payUrl trả về
        const amount = order.total_price;
        const txnRef = `DH${order.id}_${Date.now()}`;
        
        // Trả về một URL giả định để FE redirect người dùng sang màn hình quét mã QR
        const mockPayUrl = `https://mock-payment-gateway.com/pay?amount=${amount}&ref=${txnRef}&method=${method}`;

        return {
            payUrl: mockPayUrl,
            message: 'Vui lòng truy cập đường dẫn để thanh toán'
        };
    },

    // Hàm gọi khi User bị redirect trả về Website/App từ App ngân hàng
    verifyPayment: async (orderId: number, callbackData: any) => {
        const order = await orderModel.findById(orderId);
        if (!order) throw new Error('Đơn hàng không tồn tại');

        // Phân tích mã lỗi (Ví dụ VNPay trả về vnp_ResponseCode === '00' là thành công)
        const isSuccess = callbackData && (callbackData.resultCode === '0' || callbackData.vnp_ResponseCode === '00');

        if (isSuccess) {
            // Đổi trạng thái ngay lập tức
            await orderModel.updateStatus(orderId, 'CONFIRMED', 'PAID');
            return { success: true, message: 'Thanh toán thành công' };
        } else {
            // Trường hợp khách bấm "Hủy giao dịch"
            await orderModel.updateStatus(orderId, 'PENDING', 'UNPAID');
            return { success: false, message: 'Thanh toán thất bại hoặc đã bị hủy' };
        }
    },

    // Hàm Server-to-Server Webhook:
    // Chạy ngầm khi Ví điện tử chủ động POST dữ liệu vào Server (Chống trường hợp khách tắt điện thoại giữa chừng)
    handleWebhook: async (webhookData: any) => {
        try {
            // 1. Xác thực chữ ký (Signature/Checksum) để chống Hacker gửi request láo
            const secretKey = process.env.PAYMENT_SECRET || 'test_secret_key';
            
            /* GIẢ LẬP CHECK HMAC:
            const rawSignature = `partnerCode=${webhookData.partnerCode}&accessKey=${webhookData.accessKey}&requestId=${webhookData.requestId}&amount=${webhookData.amount}&orderId=${webhookData.orderId}...`;
            const hash = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
            
            if (hash !== webhookData.signature) {
                 console.error('[WEBHOOK ERROR] Sai chữ ký bảo mật!');
                 return { status: 'error', message: 'Invalid signature' };
            }
            */

            // 2. Parse ID đơn hàng từ chuỗi TxnRef (Ví dụ: "DH123_1730000000" => 123)
            let rawOrderId = webhookData.orderId || webhookData.vnp_TxnRef;
            if (typeof rawOrderId === 'string') {
                rawOrderId = rawOrderId.replace('DH', '').split('_')[0];
            }
            
            const orderId = Number(rawOrderId);
            const isSuccess = webhookData.resultCode === 0 || webhookData.vnp_ResponseCode === '00';

            const order = await orderModel.findById(orderId);
            if (!order) return { status: 'error', message: 'Order not found' };

            // 3. Cập nhật nếu chưa xử lý
            if (order.payment_status !== 'PAID' && isSuccess) {
                await orderModel.updateStatus(orderId, 'CONFIRMED', 'PAID');
                console.log(`✅ [WEBHOOK] Đã âm thầm cập nhật đơn hàng ${orderId} thành ĐÃ THANH TOÁN`);
            }

            // Trả về mã HTTP 200 cho Ví điện tử biết mình đã nhận, nếu không nó sẽ call lại liên tục
            return { status: 'success', message: 'Webhook received' };

        } catch (error) {
            console.error('❌ [WEBHOOK] Lỗi xử lý callback:', error);
            return { status: 'error', message: 'Internal Server Error' };
        }
    }
};
