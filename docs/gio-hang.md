# Chức năng: Thêm vào giỏ hàng
## Đặc tả use case
| Tên Use Case | Thêm vào giỏ hàng |
|--------------|-------------------|
| Tác nhân chính | Khách hàng |
| Mô tả | Lưu trữ sản phẩm (có sẵn hoặc tự thiết kế) vào danh sách chờ thanh toán của khách hàng. |
| Luồng sự kiện chính | 1.	Tại màn hình Danh mục, Chi tiết bánh có sẵn hoặc Thiết kế (tự chọn) khách hàng nhấn nút "Thêm vào giỏ" (hoặc biểu tượng giỏ hàng nhanh). <br>2.	Hệ thống tiếp nhận yêu cầu và ID sản phẩm/Gói cấu hình.<br>3.	Hệ thống đối soát số lượng khách yêu cầu với số dư thực tế trong kho<br>4.	Hệ thống lấy giá niêm yết hoặc tổng giá từ các thành phần cấu hình.<br>5.	Hệ thống xử lý lưu trữ:<br>- Bánh có sẵn: Cập nhật ID và số lượng.<br>- Bánh tự thiết kế: Đóng gói cấu hình (Size, Cốt, Nhân, Kem, Topping, Ghi chú). <br>6.	Hệ thống hiển thị thông báo "Đã thêm vào giỏ hàng thành công". |
| Ngoại lệ | Sản phẩm đã tồn tại trong giỏ: Nếu sản phẩm (hoặc gói cấu hình y hệt) đã có trong giỏ, hệ thống chỉ cộng dồn số lượng thay vì tạo dòng mới.<br><br>Vượt quá số lượng: Nếu khách thêm số lượng lớn hơn số lượng còn lại trong kho, hệ thống thông báo số lượng tối đa có thể mua.<br><br>Thông báo lỗi kho hàng: Nếu phát hiện sai lệch dữ liệu kho ngay tại thời điểm nhấn nút, hệ thống báo lỗi và không cho thực hiện lệnh lưu. |
| Hậu điều kiện | Biểu tượng giỏ hàng trên Header cập nhật số lượng món hàng mới. Dữ liệu giỏ hàng được lưu vào Database. |

## Biểu đồ use case

<img width="915" height="745" alt="Image" src="https://github.com/user-attachments/assets/d285c0f1-2cc6-4acd-b67a-3e418336aff2" />

## Biểu đồ hoạt động

<img width="915" height="1314" alt="Image" src="https://github.com/user-attachments/assets/e9d8191d-7522-4ffc-adf3-e31de51b82f7" />

# Chức năng: Quản lý giỏ hàng
## Đặc tả use case
| Tên Use Case | Quản lý giỏ hàng |
|--------------|------------------|
| Tác nhân chính | Khách hàng |
| Mô tả | Cho phép khách hàng xem lại danh sách bánh đã chọn, điều chỉnh số lượng hoặc loại bỏ những món không muốn mua nữa. |
| Luồng sự kiện chính (Xem) | 1.	Khách hàng nhấn vào biểu tượng Giỏ hàng.<br>2.	Hệ thống truy xuất và hiển thị danh sách sản phẩm (Ảnh, Tên, Chi tiết custom, Đơn giá).<br>3.	Hệ thống tính toán và hiển thị Tổng tiền tạm tính. |
| Luồng phụ (Cập nhật) | 1.	Khách hàng nhấn nút (+) hoặc (-) tại một sản phẩm.<br>2.	Hệ thống cập nhật số lượng mới vào DB và tính lại tổng tiền ngay lập tức. |
| Luồng phụ (Xóa) | 1.	Khách hàng nhấn nút "Xóa" tại một sản phẩm.<br>2.	Hệ thống hiển thị xác nhận "Bạn có muốn bỏ sản phẩm này?".<br>3.	Nếu khách đồng ý, hệ thống xóa sản phẩm khỏi giỏ và cập nhật giao diện. |
| Hậu điều kiện | Dữ liệu giỏ hàng được cập nhật chính xác cho bước Thanh toán tiếp theo. |
## Biểu đồ use case

<img width="915" height="776" alt="Image" src="https://github.com/user-attachments/assets/248022c8-f28b-4b4f-8754-663512265d4c" />

## Biểu đồ hoạt động

<img width="915" height="1280" alt="Image" src="https://github.com/user-attachments/assets/98922efb-0147-43c3-a24f-26eb879c70cb" />
