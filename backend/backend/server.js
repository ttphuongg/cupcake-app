const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Logic Kiểm tra mã giảm giá
app.post('/validate-discount', (req, res) => {
    const { code } = req.body;
    // Nếu mã là "GiamGia10" thì giảm 10k
    if (code === "GiamGia10") {
        return res.json({ success: true, discount: 10000 });
    }
    res.status(400).json({ success: false, message: "Sai mã giảm giá!" });
});

// 2. Logic Xử lý thanh toán
app.post('/process-payment', (req, res) => {
    const { amount, method } = req.body;
    // Giả lập: Tỷ lệ thành công 80%
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
        res.json({ success: true, message: "Thanh toán thành công!" });
    } else {
        res.status(400).json({ success: false, message: "Thanh toán thất bại. Tài khoản không đủ tiền." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});