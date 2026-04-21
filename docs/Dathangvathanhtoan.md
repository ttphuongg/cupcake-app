Biểu đồ USECASE và bảng đặc tả

## Nhóm Đặt hàng và thanh toán

### Use Case: Đặt hàng và thanh toán
<img width="975" height="949" alt="image" src="https://github.com/user-attachments/assets/66f8db63-47a1-401b-9a24-61e8599a60a2" />
| Thuộc tính | Mô tả |
|----------|----------|
| **Tên Use Case** | Hoàn tất thanh toán|
| **Mã Use Case** | UC9999999999999 |
| **Tác nhân chính** | Actor (Khách hàng - người dùng đã đăng nhập) |
| **Mô tả** | Khách hàng thực hiện trả tiền cho đơn hàng thông qua phương thức đã chọn để kết thúc quá trình mua bánh. |
| **Tiền điều kiện** | Khách hàng đã đăng nhập, có sản phẩm trong giỏ hàng và đã thực hiện bước "Xác nhận đơn hàng". |
| **Hậu điều kiện** | Hệ thống ghi nhận thanh toán thành công và chuyển trạng thái đơn hàng sang "Đã thanh toán".|
| **Luồng sự kiện chính (Basic Flow)** | 1. Hệ thống hiển thị tổng số tiền cần thanh toán.<br>2. Khách hàng nhấn nút "Thanh toán".<br>3. Hệ thống kết nối với bên thứ 3 (Ngân hàng/Ví điện tử).<br>4. Khách hàng nhập thông tin xác thực (OTP/Mật khẩu).<br>5. Hệ thống nhận phản hồi thành công và hiển thị thông báo hoàn tất đơn hàng.|
| **Luồng thay thế (Alternative Flow)** |- Thanh toán thất bại: Nếu tài khoản không đủ tiền, hệ thống thông báo lỗi và yêu cầu chọn lại phương thức hoặc thử lại.<br>- Hủy giao dịch: Khách hàng thoát giữa chừng, hệ thống lưu đơn hàng ở trạng thái "Chờ thanh toán".|
| **Điều kiện kích hoạt** | Người dùng click vào menu **"Đặt hàng"**


## Biểu đồ hoạt động
<img width="880" height="1045" alt="image" src="https://github.com/user-attachments/assets/a7b7f679-1215-4c59-ad59-5a6c363e9e6e" />
 

