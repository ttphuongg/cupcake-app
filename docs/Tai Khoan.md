# Báo cáo Phân tích nghiệp vụ

## I. MÔ TẢ NGHIỆP VỤ

### 1. Tổng quan
Nhóm tài khoản cho phép người dùng:
* Tạo tài khoản mới (Đăng ký)
* Truy cập hệ thống (Đăng nhập)
* Quản lý thông tin cá nhân
* Đổi mật khẩu

**Hệ thống cần đảm bảo:**
* Bảo mật thông tin người dùng
* Xác thực đúng người dùng
* Dễ sử dụng

### 2. Các tác nhân (Actors)
* **Người dùng (User):** sử dụng hệ thống.
* **Hệ thống (System):** xử lý logic, xác thực.

### 3. Các chức năng chính

#### 3.1 Đăng ký
* **Người dùng nhập:** Username / Email, Mật khẩu, Xác nhận mật khẩu.
* **Hệ thống kiểm tra:** Trùng tài khoản, Định dạng hợp lệ.
* **Hệ thống:** Lưu vào database.

#### 3.2 Đăng nhập
* **Người dùng nhập:** Username/email + mật khẩu.
* **Hệ thống:** Kiểm tra tồn tại, So khớp mật khẩu.
* **Kết quả:** Thành công → vào hệ thống | Thất bại → báo lỗi.

#### 3.3 Quản lý tài khoản
* Xem thông tin.
* **Cập nhật:** Tên, Email, SĐT (nếu có).

#### 3.4 Đổi mật khẩu
* **Người dùng nhập:** Mật khẩu cũ, Mật khẩu mới.
* **Hệ thống kiểm tra:** Mật khẩu cũ đúng.
* **Hệ thống:** Cập nhật mật khẩu mới.

---

## II. UC VÀ BẢNG ĐẶC TẢ

### 1. UC01 - Đăng Ký
<img width="975" height="506" alt="image" src="https://github.com/user-attachments/assets/2b953c11-5a43-48a2-b5cf-c487e7b14148" />

| Thuộc tính | Mô tả |
| :--- | :--- |
| **Tên Use Case** | Đăng ký tài khoản |
| **Mã Use Case** | UC01 |
| **Mục tiêu** | Cho phép người dùng tạo tài khoản mới |
| **Tác nhân chính** | Người dùng |
| **Mức độ ưu tiên** | Cao |
| **Tiền điều kiện** | • Người dùng chưa đăng nhập <br> • Hệ thống hoạt động bình thường |
| **Hậu điều kiện** | • Tài khoản mới được lưu vào hệ thống <br> • Người dùng có thể đăng nhập |
| **Luồng sự kiện chính** | 1. Người dùng nhập thông tin đăng ký <br> 2. Người dùng xác nhận đăng ký <br> 3. Hệ thống kiểm tra dữ liệu <br> 4. Hệ thống kiểm tra email tồn tại <br> 5. Hệ thống kiểm tra mật khẩu hợp lệ <br> 6. Hệ thống kiểm tra xác nhận mật khẩu <br> 7. Hệ thống lưu tài khoản <br> 8. Hiển thị thông báo thành công |
| **Luồng thay thế** | • Email đã tồn tại → yêu cầu nhập email khác <br> • Mật khẩu không hợp lệ → yêu cầu nhập lại <br> • Mật khẩu xác nhận không khớp → yêu cầu nhập lại <br> • Lỗi hệ thống → thông báo và thử lại |
| **Dữ liệu vào** | Email / Username, Mật khẩu, Xác nhận mật khẩu |
| **Dữ liệu ra** | Thông báo thành công hoặc lỗi |
| **Điều kiện kích hoạt** | Người dùng chọn chức năng "Đăng ký" |

### 2. UC02 – Đăng Nhập
<img width="928" height="642" alt="image" src="https://github.com/user-attachments/assets/7f87fa70-f3db-4b47-8c82-7e75e834ebc3" />

| Thuộc tính | Mô tả |
| :--- | :--- |
| **Tên Use Case** | Đăng nhập Tài Khoản |
| **Mã Use Case** | UC02 |
| **Mục tiêu** | Cho phép người dùng truy cập hệ thống |
| **Tác nhân chính** | Người dùng |
| **Mức độ ưu tiên** | Cao |
| **Tiền điều kiện** | Người dùng đã có tài khoản |
| **Hậu điều kiện** | Người dùng đăng nhập thành công và truy cập hệ thống |
| **Luồng sự kiện chính** | 1. Nhập tài khoản <br> 2. Nhập mật khẩu <br> 3. Xác nhận đăng nhập <br> 4. Kiểm tra tài khoản tồn tại <br> 5. Xác thực mật khẩu <br> 6. Tạo session <br> 7. Cho phép truy cập hệ thống |
| **Luồng thay thế** | • Tài khoản không tồn tại → báo lỗi <br> • Sai mật khẩu → nhập lại <br> • Tài khoản bị khóa → không cho đăng nhập <br> • Có thể chọn quên mật khẩu |
| **Dữ liệu vào** | Email / Username, Mật khẩu |
| **Dữ liệu ra** | Trạng thái đăng nhập |
| **Điều kiện kích hoạt** | Người dùng chọn "Đăng nhập" |

### 3. UC03 – Cập Nhật Thông Tin Tài Khoản
<img width="927" height="497" alt="image" src="https://github.com/user-attachments/assets/e586f08f-cdeb-42f4-9f9e-cb75ceb2593d" />

| Thuộc tính | Mô tả |
| :--- | :--- |
| **Tên Use Case** | Cập nhật thông tin tài khoản |
| **Mã Use Case** | UC03 |
| **Mục tiêu** | Cho phép người dùng chỉnh sửa thông tin cá nhân |
| **Tác nhân chính** | Người dùng |
| **Mức độ ưu tiên** | Trung bình |
| **Tiền điều kiện** | Người dùng đã đăng nhập hệ thống |
| **Hậu điều kiện** | Thông tin tài khoản được cập nhật |
| **Luồng sự kiện chính** | 1. Nhập thông tin mới <br> 2. Xác nhận cập nhật <br> 3. Kiểm tra dữ liệu <br> 4. Kiểm tra email hợp lệ/trùng <br> 5. Cập nhật dữ liệu <br> 6. Thông báo thành công |
| **Dữ liệu vào** | Họ tên, Email, SĐT |
| **Dữ liệu ra** | Thông tin đã cập nhật |

### 4. UC04 – Đổi Mật Khẩu
<img width="928" height="580" alt="image" src="https://github.com/user-attachments/assets/f3293eed-04e6-4bda-861c-cdf7e0539767" />

| Thuộc tính | Mô tả |
| :--- | :--- |
| **Tên Use Case** | Đổi mật khẩu |
| **Mã Use Case** | UC04 |
| **Mục tiêu** | Thay đổi mật khẩu để bảo mật |
| **Tác nhân chính** | Người dùng |
| **Mức độ ưu tiên** | Cao |
| **Tiền điều kiện** | Người dùng đã đăng nhập |
| **Luồng sự kiện chính** | 1. Nhập mật khẩu cũ <br> 2. Nhập mật khẩu mới <br> 3. Xác nhận mật khẩu mới <br> 4. Kiểm tra mật khẩu cũ đúng <br> 5. Cập nhật mật khẩu mới <br> 6. Thông báo thành công |

---

## III. Biểu đồ hoạt động

1. **Đăng Ký**
 <img width="975" height="726" alt="image" src="https://github.com/user-attachments/assets/b8f79f9c-ab3b-481a-82f8-e440b57cfd67" />


2. **Đăng Nhập**
 <img width="975" height="900" alt="image" src="https://github.com/user-attachments/assets/3715a62e-0cc4-4caa-be4d-77620b996bb2" />


3. **Cập nhật thông tin**
   <img width="975" height="896" alt="image" src="https://github.com/user-attachments/assets/1df04714-6bfd-40b8-b791-bc81feec27ac" />


4. **Đổi Mật Khẩu**
  <img width="975" height="714" alt="image" src="https://github.com/user-attachments/assets/cd09741b-d07e-41f4-87ef-d8fe5ab468e6" />
