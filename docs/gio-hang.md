# Chức năng: Thêm vào giỏ hàng
## Đặc tả use case
| Tên Use Case | Thêm vào giỏ hàng |
|--------------|-------------------|
| Tác nhân chính | Khách hàng |
| Mô tả | Lưu trữ sản phẩm (có sẵn hoặc tự thiết kế) vào danh sách chờ thanh toán của khách hàng. |
| Luồng sự kiện chính | 1.	Tại màn hình danh mục, chi tiết bánh có sẵn hoặc thiết kế (tự chọn) khách hàng nhấn nút "Thêm vào giỏ" (hoặc biểu tượng giỏ hàng nhanh). <br>2.	Hệ thống tiếp nhận yêu cầu và ID sản phẩm/gói cấu hình.<br>3.	Hệ thống đối soát số lượng khách yêu cầu với số dư thực tế trong kho<br>4.	Hệ thống lấy giá niêm yết hoặc tổng giá từ các thành phần cấu hình.<br>5.	Hệ thống xử lý lưu trữ:<br>- Bánh có sẵn: Cập nhật ID và số lượng.<br>- Bánh tự thiết kế: Đóng gói cấu hình (size, cốt, nhân, kem, topping, số lượng, ghi chú). |
| Ngoại lệ | Sản phẩm đã tồn tại trong giỏ: Nếu sản phẩm (hoặc gói cấu hình y hệt) đã có trong giỏ, hệ thống chỉ cộng dồn số lượng thay vì tạo dòng mới.<br><br>Vượt quá số lượng: Nếu khách thêm số lượng lớn hơn số lượng còn lại trong kho, hệ thống thông báo số lượng tối đa có thể mua.<br><br>Thông báo lỗi kho hàng: Nếu phát hiện sai lệch dữ liệu kho ngay tại thời điểm nhấn nút, hệ thống báo lỗi và không cho thực hiện lệnh lưu. |
| Hậu điều kiện | Biểu tượng giỏ hàng trên header cập nhật số lượng món hàng mới. Dữ liệu giỏ hàng được lưu vào database. |


# Chức năng: Quản lý giỏ hàng
## Đặc tả use case
| Tên Use Case | Quản lý giỏ hàng |
|--------------|------------------|
| Tác nhân chính | Khách hàng |
| Mô tả | Cho phép khách hàng xem lại danh sách bánh đã chọn, điều chỉnh số lượng hoặc loại bỏ những món không muốn mua nữa. |
| Luồng sự kiện chính (Xem) | 1.	Khách hàng nhấn vào biểu tượng giỏ hàng.<br>2.	Hệ thống truy xuất và hiển thị danh sách sản phẩm (ảnh, tên, chi tiết thiết kế, đơn giá).<br>3.	Hệ thống tính toán và hiển thị tổng tiền tạm tính. |
| Luồng phụ (Cập nhật) | 1.	Khách hàng nhấn nút (+) hoặc (-) tại một sản phẩm.<br>2.	Hệ thống cập nhật số lượng mới vào DB và tính lại tổng tiền ngay lập tức. |
| Luồng phụ (Xóa) | 1.	Khách hàng nhấn nút "Xóa" tại một sản phẩm.<br>2.	Hệ thống xóa sản phẩm khỏi giỏ và cập nhật giao diện. |
| Hậu điều kiện | Dữ liệu giỏ hàng được cập nhật chính xác cho bước đặt hàng/thanh toán tiếp theo. |
## Biểu đồ use case

<img width="704" height="554" alt="image" src="https://github.com/user-attachments/assets/af6ee677-97d0-47ae-a27e-9c21cc7be58b" />


## Biểu đồ hoạt động

<img width="601" height="793" alt="image" src="https://github.com/user-attachments/assets/16250320-52d4-4f73-b502-25c5193fc188" />

<img width="739" height="881" alt="image" src="https://github.com/user-attachments/assets/a5aa6384-70a1-441e-89e0-392170ba98bb" />


