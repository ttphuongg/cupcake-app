# 🧁 Cupcake Customizer App 

## 1. Mô tả bài toán
Hiện nay, giới trẻ không chỉ quan tâm đến hương vị mà còn chú trọng đến yếu tố thẩm mỹ của sản phẩm. Một chiếc cupcake không còn đơn thuần là món ăn mà còn trở thành phương tiện thể hiện phong cách cá nhân và phục vụ nhu cầu chia sẻ trên các nền tảng mạng xã hội. Do đó, nhu cầu **cá nhân hóa (personalization)** ngày càng trở nên phổ biến, khi người dùng mong muốn chủ động quyết định hình thức và hương vị của sản phẩm thay vì lựa chọn các mẫu có sẵn.

Từ thực tế đó, bài toán đặt ra là xây dựng một nền tảng kỹ thuật số giúp thu hẹp khoảng cách giữa khách hàng và quá trình tạo ra sản phẩm. Tại đây, người dùng có thể trực tiếp tham gia vào việc thiết kế bánh, từ lựa chọn độ ngọt, loại cốt bánh đến cách phối hợp kem và các thành phần trang trí. Mỗi sản phẩm không chỉ là một đơn hàng mà còn mang tính cá nhân hóa, phản ánh sở thích và nhu cầu riêng của từng khách hàng.

Để đáp ứng yêu cầu này, ứng dụng được xây dựng với hai định hướng chính:
* **Tiện lợi:** Cung cấp sẵn các mẫu bánh nhằm đáp ứng nhu cầu đặt hàng nhanh chóng.
* **Cá nhân hóa:** Tích hợp chức năng tự thiết kế bánh, cho phép người dùng tùy chỉnh các thành phần theo mong muốn.

---

## 2. Yêu cầu chức năng (Functional Requirements)

### 2.1. Nhóm chức năng Quản lý tài khoản
* Đăng ký, đăng nhập, đăng xuất.
* **Quên mật khẩu:** Hỗ trợ khôi phục thông qua Email hoặc số điện thoại.
* **Cập nhật thông tin cá nhân:** Chỉnh sửa họ tên, SĐT, địa chỉ (tự động điền khi đặt hàng).
* Xóa tài khoản.

### 2.2. Nhóm chức năng Duyệt và tìm kiếm sản phẩm
* **Xem danh sách sản phẩm:** Hiển thị các mẫu cupcake có sẵn.
* **Xem chi tiết sản phẩm:** Bao gồm mô tả, thành phần và đánh giá từ người dùng khác.
* **Tìm kiếm và lọc:** Theo tên sản phẩm hoặc tiêu chí như hương vị, mức giá.

### 2.3. Nhóm chức năng Thiết kế bánh (Customizer)
* **Lựa chọn thành phần:** Kích thước (Size), Độ ngọt, Cốt bánh, Nhân bánh, Kem phủ (Frosting), Topping (Trang trí).
* **Xem trước (Preview):** Hiển thị hình ảnh mô phỏng dựa trên lựa chọn.
* **Thêm vào giỏ hàng:** Lưu lại toàn bộ cấu hình bánh đã thiết kế như một sản phẩm trong giỏ.

### 2.4. Nhóm chức năng Giỏ hàng và đặt hàng
* **Quản lý giỏ hàng:** Xem danh sách, cập nhật số lượng hoặc xóa sản phẩm.
* **Xác nhận đặt hàng:** Nhập thông tin giao hàng, chọn thời gian nhận, áp dụng voucher.
* **Thanh toán:** Lựa chọn phương thức thanh toán và hoàn tất đơn hàng.

### 2.5. Nhóm chức năng Sau bán hàng
* **Xem lịch sử đơn hàng:** Chi tiết từng đơn đã đặt.
* **Đặt lại đơn hàng:** Đặt lại nhanh các đơn hàng trước đó.
* **Đánh giá sản phẩm:** Gửi nhận xét, hình ảnh và đánh giá số sao.

---

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

* **Giao diện (UI/UX):** Thiết kế trẻ trung, hiện đại, tối ưu cho thao tác chạm trên thiết bị di động. 
* **Hiệu năng:** Thời gian tải trang < 3s. Trình giả lập thiết kế không gây lag máy.
* **Tính chân thực:** Hình ảnh minh họa nguyên liệu và bánh mẫu phải sắc nét, đúng với thực tế.
* **Độ tin cậy:** Hoạt động 24/7. Không mất dữ liệu đơn hàng khi gặp sự cố mạng. 
* **Bảo mật:** Mã hóa thông tin thanh toán và bảo mật thông tin cá nhân khách hàng. 
