# 1\. Phân tích
Phân tích nghiệp vụ  
Tác nhân: Khách hàng, Hệ thống (xử lý dữ liệu, hiển thị thông tin và cập nhật trạng thái đơn hàng vào DataBase).  

Xem lịch sử đơn hàng tổng quát:  
(1): Khách hàng nhấp vào Button Lịch sử  
(2): Hệ thống hiển thị ra màn hình danh sách các đơn hàng mà khách hàng đã thực hiện (bao gồm các trạng thái: Tất cả, Chờ xác nhận, Đã xác nhận, Đang xử lý, Đang giao hàng, Hoàn thành, Đã hủy, Đã đánh giá; và các chức năng Xem chi tiết, Mua lại, Đánh giá).  
Xem chi tiết đơn hàng:  
(1): Ở giao diện Xem lịch sử mua hàng tổng quát, Khách hàng nhấp chọn Button Xem chi tiết của 1 đơn hàng cụ thể.  
(2): Hệ thống hiển thị ra màn hình thông tin chia tiết Gồm: Địa chỉ nhận hàng (Tên, SĐT, Địa chỉ), Trạng thái đơn hàng (Thông tin vận chuyển, Ngày giờ), Thông tin đơn hàng (Mã đơn hàng, Thời gian đặt, Hình thức thanh toán, Thời gian giao), Thông tin sản phẩm (Tên sản phẩm, Mã sản phẩm, Đơn giá, Số lượng, Thành tiền), Tổng cộng (Tổng tiền sản phẩm, Phí dịch vụ, Phí giao hàng). Ngoài ra, bao gồm thêm các chức năng là Mua lại và Đánh giá.  
Đặt lại đơn hàng:  
(1): Khách hàng đang ở giao diện Lịch sử mua hàng hoặc Xem chi tiết đơn hàng nhất chọn Button Đặt lại.  
(2): Hệ thống sao chép các sản phẩm từ đơn hàng cũ vào giỏ hàng hiện tại. Các thao tác tiếp theo làm như đặt đơn hàng mới.  
Hủy đơn hàng:  
(1): Khi đơn hàng ở trạng thái "Chờ xác nhận", Khách hàng được quyền hủy đơn hàng. Còn ở các các trạng thái sau sẽ không được hủy và chức năng bị khóa. Nếu muốn phải liên hệ CSKH.  
(2): Hệ thống hủy nếu đơn hàng đạt yêu cầu.  
Quy tắc nghiệp vụ  
Xem chi tiết: Chỉ xem được đơn hàng thuộc sở hữu của tài khoản đang đăng nhập.  
Đặt lại đơn: Kiểm tra tồn kho của sản phẩm tại thời điểm hiện tại. Nếu sản phẩm đã ngừng bán, phải thông báo cho người dùng.  
Hủy đơn hàng  
- Chỉ cho phép khi trạng thái là Chờ duyệt  
- Phải yêu cầu người dùng nhập lý do hủy  
Lịch sử đơn: Sắp xếp theo thứ tự thời gian mới nhất lên đầu  
# 2\. Biểu đồ UC

![Đơn hàng](https://github.com/user-attachments/assets/a167457a-5bed-4e13-906e-a4958f7eaa15)


1.1. Xem lịch sử tổng quát

| Tên UC | Xem lịch sử đơn hàng tổng quát |
| :---- | :---- |
| Mã UC | UC-01 |
| Tác nhân | Khách hàng |
| Mô tả | Cho phép khách hàng xem danh sách tất cả các đơn hàng đã thực hiện và trạng thái hiện tại của chúng. |
| Tiền điều kiện | Khách hàng đã đăng nhập thành công vào hệ thống. |
| Hậu điều kiện | Danh sách đơn hàng được hiển thị đầy đủ với các bộ lọc trạng thái. |
| Luồng chính | Khách hàng nhấn vào nút “Lịch sử” Hệ thống truy xuất cơ sở dữ liệu để lấy danh sách đơn hàng của tài khoản đang đăng nhập. Hệ thống hiển thị danh sách đơn hàng theo thứ tự thời gian mới nhất lên đầu. Danh sách bao gồm các tab trạng thái: Tất cả, Chờ xác nhận, Đã xác nhận, Đang xử lý, Đang giao hàng, Hoàn thành, Đã hủy, Đã đánh giá. Khách hàng có thể chọn các tab trạng thái để lọc danh sách đơn hàng tương ứng. Hệ thống cập nhật và hiển thị danh sách theo bộ lọc đã chọn. Khách hàng có thể thực hiện tiếp các hành động: Xem chi tiết, Mua lại, hoặc Đánh giá trên từng đơn hàng. |
| Luồng phụ | Không có đơn hàng nào: Nếu khách hàng chưa từng mua hàng, hệ thống hiển thị thông báo: "Bạn chưa có đơn hàng nào". Lỗi kết nối: Nếu không thể truy xuất dữ liệu từ Database, hệ thống hiển thị thông báo: "Lỗi kết nối, vui lòng thử lại sau". |
| Giao diện | Các thông tin hiển thị trên mỗi dòng đơn hàng trong danh sách tổng quát: Mã đơn hàng Ngày đặt hàng Tổng số tiền thanh toán Trạng thái hiện tại (VD: Đang giao hàng). Các nút chức năng nhanh: \[Xem chi tiết\], \[Mua lại\], \[Đánh giá\] (Nút đánh giá chỉ hiện khi trạng thái là Hoàn thành). |

1.2. Xem chi tiết đơn hàng

| Tên UC | Xem chi tiết đơn hàng |
| :---- | :---- |
| Mã UC | UC-02 |
| Tác nhân | Khách hàng |
| Mô tả | Cho phép khách hàng xem toàn bộ thông tin chi tiết của một đơn hàng cụ thể bao gồm: địa chỉ, trạng thái vận chuyển, danh sách sản phẩm và chi tiết thanh toán. |
| Tiền điều kiện | Khách hàng đang ở giao diện "Xem lịch sử đơn hàng tổng quát". |
| Hậu điều kiện | Thông tin chi tiết của đơn hàng được hiển thị đầy đủ trên màn hình |
| Luồng chính | Khách hàng nhấn chọn nút "Xem chi tiết" của một đơn hàng cụ thể trong danh sách lịch sử. Hệ thống: 2.1. Nhận mã đơn hàng (Order\_ID) và truy xuất dữ liệu từ các bảng: Đơn hàng, Vận chuyển, Chi tiết đơn hàng và Sản phẩm. 2.2. Hiển thị giao diện Chi tiết đơn hàng với các phân đoạn thông tin: Địa chỉ nhận hàng: Tên người nhận, SĐT, Địa chỉ chi tiết. Trạng thái đơn hàng: Lộ trình vận chuyển, ngày giờ cập nhật trạng thái. Thông tin đơn hàng: Mã đơn, Thời gian đặt, Hình thức thanh toán, Thời gian giao dự kiến. Danh sách sản phẩm: Tên SP, Mã SP, Đơn giá, Số lượng, Thành tiền từng món. Tổng cộng: Tổng tiền hàng, Phí dịch vụ, Phí giao hàng, Tổng thanh toán cuối cùng. Khách hàng xem thông tin và có thể chọn thực hiện Mua lại hoặc Đánh giá. |
| Luồng phụ | Đơn hàng không tồn tại hoặc bị xóa: Nếu dữ liệu đơn hàng không còn trong hệ thống, hiển thị thông báo: "Dữ liệu đơn hàng không tồn tại. Vui lòng quay lại danh sách." Lỗi tải hình ảnh sản phẩm: Nếu không tải được ảnh sản phẩm, hệ thống hiển thị ảnh mặc định (Placeholder) nhưng vẫn giữ nguyên thông tin văn bản (Tên, Giá). |
| Giao diện | Header: Mã đơn hàng và Trạng thái tổng quát (ví dụ: Đã giao). Body: Các thẻ thông tin (Địa chỉ, Vận chuyển, Sản phẩm). Footer: Các nút hành động \[Mua lại\], \[Đánh giá\], \[Hủy đơn\] (tùy trạng thái). |

1.3. Hủy đơn hàng

| Tên UC | Hủy đơn hàng |
| :---- | :---- |
| Mã UC | UC-03 |
| Tác nhân | Khách hàng |
| Mô tả | Cho phép khách hàng dừng việc mua hàng đối với các đơn hàng mới đặt và chưa được hệ thống/nhà bán hàng xác nhận xử lý. |
| Tiền điều kiện | Khách hàng đã đăng nhập và đang ở màn hình "Lịch sử đơn hàng" hoặc "Xem chi tiết đơn hàng". |
| Hậu điều kiện | Trạng thái đơn hàng được chuyển thành "Đã hủy". Số lượng tồn kho sản phẩm được hoàn lại (nếu có). |
| Luồng chính | Khách hàng nhấn nút "Hủy đơn" tại một đơn hàng cụ thể. Hệ thống kiểm tra trạng thái hiện tại của đơn hàng trong Database. Hệ thống xác nhận trạng thái là "Chờ xác nhận". Hệ thống hiển thị hộp thoại yêu cầu khách hàng xác nhận lại và chọn/nhập lý do hủy đơn. Khách hàng chọn lý do và nhấn "Xác nhận hủy". Hệ thống cập nhật trạng thái đơn hàng thành "Đã hủy" trong Database. Hệ thống gửi thông báo hủy đơn thành công và cập nhật lại giao diện người dùng. |
| Luồng phụ | Trạng thái không hợp lệ (Đã xác nhận/ Đang giao/ Hoàn thành): Tại bước 3, nếu trạng thái đơn hàng không phải là "Chờ xác nhận", hệ thống sẽ ẩn nút Hủy hoặc hiển thị thông báo: "Đơn hàng đã được xử lý, không thể hủy trực tiếp. Vui lòng liên hệ CSKH để được hỗ trợ." Khách hàng thay đổi ý định (Không muốn Hủy đơn): Tại bước 5, nếu khách hàng nhấn "Hủy bỏ/Quay lại", hệ thống đóng hộp thoại và giữ nguyên trạng thái đơn hàng. |
| Giao diện | Nút bấm: Hủy đơn hàng Hộp thoại xác nhận: Tiêu đề: "Bạn có chắc chắn muốn hủy đơn hàng này?" Danh sách lý do (Dropdown): Thay đổi địa chỉ, Tìm thấy giá rẻ hơn, Không muốn mua nữa, Khác.. Nút lệnh: \[Đồng ý hủy\] và \[Quay lại\]. |

1.4. Đặt lại đơn hàng

| Tên UC | Đặt lại đơn hàng |
| :---- | :---- |
| Mã UC | UC-04 |
| Tác nhân | Khách hàng |
| Mô tả | Cho phép khách hàng sao chép nhanh danh sách sản phẩm từ một đơn hàng cũ (đã hoàn thành hoặc đã hủy) vào giỏ hàng hiện tại để tiến hành đặt hàng mới. |
| Tiền điều kiện | Khách hàng đã có ít nhất một đơn hàng trong lịch sử. |
| Hậu điều kiện | Các sản phẩm hợp lệ từ đơn hàng cũ được thêm vào giỏ hàng hiện tại. Người dùng được chuyển đến màn hình Giỏ hàng. |
| Luồng chính | Khách hàng nhấn nút "Đặt lại" tại một đơn hàng cũ. Hệ thống kiểm tra danh sách sản phẩm trong đơn hàng cũ đó. Trường hợp tất cả sản phẩm hợp lệ: Hệ thống tự động thêm toàn bộ sản phẩm (với số lượng cũ) vào giỏ hàng. Hệ thống thông báo: "Đã thêm sản phẩm vào giỏ hàng thành công". Hệ thống điều hướng khách hàng đến màn hình Giỏ hàng để kiểm tra và thanh toán. |
| Luồng phụ | Một số sản phẩm đã hết hàng hoặc ngừng kinh doanh:  Tại bước 3, nếu có sản phẩm không khả dụng, hệ thống chỉ thêm các sản phẩm còn hàng vào giỏ. Hệ thống hiển thị thông báo: "Một số sản phẩm đã hết hàng nên không được thêm vào giỏ. Vui lòng kiểm tra lại." Tất cả sản phẩm đều không khả dụng: Hệ thống thông báo: "Rất tiếc, các sản phẩm trong đơn hàng này hiện không còn kinh doanh. Không thể đặt lại." |
| Giao diện | Nút bấm: Đặt lại Chuyển sang giao diện như đơn hàng mới |

# 3\. Biểu đồ Hoạt động
![Activity Diagram1](https://github.com/user-attachments/assets/7d51ab48-fe3f-4e58-ada0-71e4c8a962ab)


