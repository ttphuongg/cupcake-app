# Biểu đồ USECASE và bảng đặc tả

## Nhóm sản phẩm

### Use Case: Tra cứu sản phẩm
<img width="939" height="461" alt="image" src="https://github.com/user-attachments/assets/08950454-8d20-4b88-ad25-f5b79b342201" />

| Thuộc tính | Mô tả |
|----------|----------|
| **Tên Use Case** | Tra cứu sản phẩm |
| **Mã Use Case** | UC9999999999999 |
| **Mục tiêu** | Cho phép người dùng xem, tìm kiếm và lọc danh sách các sản phẩm hiện có trên hệ thống để tìm ra sản phẩm mong muốn. |
| **Tác nhân chính** | Actor (Khách hàng - người dùng đã đăng nhập) |
| **Mức độ ưu tiên** | Cao |
| **Tiền điều kiện** | Hệ thống đang hoạt động và người dùng đã truy cập vào giao diện trang chủ hoặc trang danh mục sản phẩm. |
| **Hậu điều kiện** | Hệ thống trả về và hiển thị danh sách các sản phẩm trùng khớp với tiêu chí tra cứu của người dùng. |
| **Dữ liệu vào** | - Từ khóa tìm kiếm (nếu sử dụng tính năng tìm kiếm).<br>- Các tham số lọc (nếu sử dụng tính năng lọc). |
| **Dữ liệu ra** | Giao diện danh sách các sản phẩm (Hình ảnh, tên, giá bán...) thỏa mãn điều kiện. |
| **Điều kiện kích hoạt** | Người dùng click vào menu **"Sản phẩm"**, hoặc nhập từ khóa vào thanh tìm kiếm trên hệ thống. |

#### Luồng sự kiện chính
1. Người dùng truy cập vào trang danh sách sản phẩm.
2. Hệ thống truy xuất cơ sở dữ liệu và hiển thị danh sách sản phẩm mặc định.
3. Người dùng duyệt qua danh sách sản phẩm đã hiển thị.
4. Người dùng có thể chọn một sản phẩm để **"Xem chi tiết sản phẩm"** (chuyển sang Use Case khác).

#### Luồng thay thế
- **2a.** Cơ sở dữ liệu trống hoặc lỗi kết nối → Hệ thống hiển thị thông báo **"Hiện tại không có sản phẩm nào"** hoặc **"Lỗi tải dữ liệu"**.
- **3a.** Kết quả tra cứu (sau khi tìm/lọc) không khớp với bất kỳ sản phẩm nào → Hệ thống hiển thị thông báo **"Không tìm thấy sản phẩm phù hợp"**.

#### Điểm mở rộng
Tại bước 3 của luồng chính, người dùng có thể kích hoạt các Use Case mở rộng:
- **Tìm kiếm sản phẩm**: Nhập từ khóa vào thanh tìm kiếm.
- **Lọc sản phẩm**: Chọn các tiêu chí như khoảng giá, danh mục, thương hiệu...

---

## Nhóm đánh giá
<img width="939" height="483" alt="image" src="https://github.com/user-attachments/assets/8d3cda21-f989-4902-ac03-56d6a93f6668" />

### Use Case: Đánh giá sản phẩm

| Thuộc tính | Mô tả |
|----------|----------|
| **Tên Use Case** | Đánh giá sản phẩm |
| **Mã Use Case** | UC9999999999999999 |
| **Mục tiêu** | Cho phép người dùng đánh giá, chấm điểm và để lại bình luận cho sản phẩm họ đã mua. |
| **Tác nhân chính** | Actor (Người mua hàng/Khách hàng đã đăng nhập) |
| **Mức độ ưu tiên** | Cao |
| **Tiền điều kiện** | Người dùng đã đăng nhập vào hệ thống. |
| **Hậu điều kiện** | Đánh giá, số sao và hình ảnh (nếu có) được lưu vào cơ sở dữ liệu và hiển thị trên trang chi tiết của sản phẩm. |
| **Dữ liệu vào** | Mã đơn hàng/sản phẩm (ẩn), Số sao (1-5), Nội dung văn bản, File hình ảnh/video. |
| **Dữ liệu ra** | Thông báo xác nhận đánh giá thành công. Trạng thái đơn hàng cập nhật thành **"Đã đánh giá"**. |
| **Điều kiện kích hoạt** | Người dùng nhấn vào nút **"Đánh giá"**, **"Viết nhận xét"** trên trang chi tiết sản phẩm hoặc trong mục **"Đơn hàng của tôi"**. |

#### Luồng sự kiện chính
1. Người dùng bấm chọn **"Đánh giá sản phẩm"**.
2. Hệ thống thực hiện **"Xác thực đơn hàng"** để kiểm tra người dùng đã mua sản phẩm này chưa.
3. Hệ thống hiển thị form nhập đánh giá.
4. Người dùng **"Chọn số sao"** (mức độ hài lòng).
5. Người dùng **"Nhập nội dung"** bình luận.
6. Người dùng **"Đính kèm hình ảnh"**.
7. Người dùng nhấn nút **"Gửi đánh giá"**.
8. Hệ thống kiểm tra dữ liệu đầu vào, lưu trữ và thông báo thành công.

#### Luồng thay thế
- **2a.** Xác thực đơn hàng thất bại (Người dùng chưa mua sản phẩm hoặc đơn hàng chưa hoàn thành) → Hệ thống chặn thao tác và hiển thị thông báo:  
  **"Bạn cần mua và nhận hàng thành công để đánh giá"**
- **8a.** Người dùng quên chọn số sao → Hệ thống báo lỗi yêu cầu hoàn thiện bắt buộc.

#### Điểm mở rộng
- Không có

---

## Xem chi tiết sản phẩm
<img width="940" height="485" alt="image" src="https://github.com/user-attachments/assets/7533edc1-4694-4dd3-ab00-4824bd12ae0c" />

### Use Case: Xem chi tiết sản phẩm

| Thuộc tính | Mô tả |
|----------|----------|
| **Tên Use Case** | Xem chi tiết sản phẩm |
| **Mã Use Case** | UC999999999999999999 |
| **Mục tiêu** | Hiển thị đầy đủ và chi tiết các thông tin của một sản phẩm cụ thể để người dùng có cái nhìn rõ nét trước khi quyết định mua hàng. |
| **Tác nhân chính** | Khách hàng (Vãng lai hoặc đã đăng nhập) |
| **Mức độ ưu tiên** | Cao |
| **Tiền điều kiện** | Người dùng đang ở trang Danh sách sản phẩm, Trang chủ hoặc kết quả Tìm kiếm/Lọc. |
| **Hậu điều kiện** | Giao diện chi tiết sản phẩm được hiển thị với đầy đủ thông tin (Hình ảnh, giá, mô tả, thông số kỹ thuật, đánh giá...). |
| **Dữ liệu vào** | Mã sản phẩm (Product ID) được gửi từ yêu cầu click của người dùng. |
| **Dữ liệu ra** | Thông tin chi tiết sản phẩm hiển thị trên màn hình. |
| **Điều kiện kích hoạt** | Người dùng click vào một sản phẩm bất kỳ trên giao diện hệ thống. |

#### Luồng sự kiện chính
1. Người dùng nhấn chọn vào tên hoặc hình ảnh của một sản phẩm cụ thể từ danh sách.
2. Hệ thống tiếp nhận mã sản phẩm (ID).
3. Hệ thống truy xuất cơ sở dữ liệu để lấy các thông tin liên quan đến sản phẩm đó.
4. Hệ thống hiển thị trang chi tiết sản phẩm bao gồm:
   - Tên sản phẩm
   - Giá bán
   - Hình ảnh/video
   - Thông tin mô tả
   - Thông số kỹ thuật
   - Trạng thái tồn kho
   - Các đánh giá từ người dùng khác

#### Luồng thay thế
- **3a.** Sản phẩm đã bị xóa hoặc ngừng kinh doanh trong lúc người dùng đang lướt web → Hệ thống hiển thị thông báo **"Sản phẩm hiện không còn tồn tại"** và quay lại trang danh sách.
- **4a.** Sản phẩm hết hàng → Hệ thống vẫn hiển thị thông tin nhưng ẩn nút **"Thêm vào giỏ hàng"** hoặc hiển thị trạng thái **"Tạm hết hàng"**.

#### Điểm mở rộng
Từ giao diện chi tiết, người dùng có thể thực hiện các Use Case khác:
- Thêm sản phẩm vào giỏ hàng
- Xem danh sách đánh giá và bình luận
- Chia sẻ sản phẩm lên mạng xã hội

---

# Biểu đồ hoạt động

## Nhóm sản phẩm
<img width="940" height="915" alt="image" src="https://github.com/user-attachments/assets/ca449873-440f-48f8-93a4-621db9309611" />


## Nhóm đánh giá
<img width="854" height="1329" alt="image" src="https://github.com/user-attachments/assets/9dd599b3-87fb-49a1-8997-e9685710a01d" />


## Xem chi tiết sản phẩm
<img width="940" height="643" alt="image" src="https://github.com/user-attachments/assets/f819d27c-a174-4d7f-a4c7-003130e6e779" />

