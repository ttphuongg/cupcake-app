## Đặc tả use case
| Tên Use Case | Thiết kế bánh cupcake tùy chỉnh |
|--------------|--------------------------------|
| Tác nhân chính | Khách hàng |
| Mô tả | Cho phép khách hàng tự chọn các thông số (Size, Đường) và phối hợp 4 thành phần: Cốt, Nhân, Kem, Topping để tạo ra mẫu bánh riêng.và xem hình ảnh mô phỏng kèm giá tiền thực tế |
| Điều kiện tiên quyết | Khách hàng đã truy cập vào tính năng "Tự thiết kế" từ màn hình chính |
| Luồng sự kiện chính | 1.	Hệ thống hiển thị giao diện thiết kế, load danh sách nguyên liệu và kiểm tra tồn kho: Nguyên liệu còn hàng (cho phép chọn), Nguyên liệu hết hàng (vô hiệu hóa/disable).<br>2.	Khách hàng lựa chọn các thông số: Size, Mức đường, Cốt bánh, Nhân, Kem, Topping.<br>3.	Với mỗi lượt chọn, hệ thống tự động cập nhật hình ảnh mô phỏng và tổng giá tiền tương ứng.<br>4.	Khách hàng nhập Ghi chú và Số lượng bánh muốn đặt. <br>5.	Hệ thống ghi nhận thông tin bổ sung. <br>6.	Khách hàng nhấn nút "Thêm vào giỏ hàng".<br>7.	Hệ thống lưu gói thiết kế vào Giỏ hàng. |
| Luồng phụ/Ngoại lệ | Hết nguyên liệu: Nếu một loại nhân, kem hoặc topping cụ thể đã hết, hệ thống sẽ làm mờ (disable) lựa chọn.<br>Thiếu thành phần chính: Nếu khách chưa chọn Cốt hoặc Kem mà đã bấm lưu, hệ thống sẽ yêu cầu hoàn tất 2 phần này. |
| Hậu điều kiện | Gói dữ liệu thiết kế hoàn chỉnh được đẩy vào Giỏ hàng. |

## Biểu đồ use case

<img width="915" height="732" alt="Image" src="https://github.com/user-attachments/assets/d87a5f10-6aca-403a-a28b-c137add424be" />

## Biểu đồ hoạt động

<img width="888" height="1183" alt="Image" src="https://github.com/user-attachments/assets/623de29f-6938-4ec0-ad5a-3602b369c962" />
