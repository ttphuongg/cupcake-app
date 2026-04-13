**Báo cáo Phân tích nghiệp vụ**
---
I. **MÔ TẢ NGHIỆP VỤ**

Nhóm chức năng “Quản lý tài khoản” cho phép người dùng tạo tài khoản, xác thực và quản lý thông tin cá nhân trong hệ thống. Hệ thống sử dụng email hoặc số điện thoại làm định danh chính thay cho username nhằm tăng tính tiện lợi và phù hợp với thực tế sử dụng.

1. **Đăng ký tài khoản**

Người dùng nhập email hoặc số điện thoại và mật khẩu để tạo tài khoản mới. Hệ thống kiểm tra định dạng và tính hợp lệ của email hoặc số điện thoại, đồng thời kiểm tra xem thông tin này đã tồn tại hay chưa. Nếu hợp lệ, hệ thống lưu tài khoản và thông báo đăng ký thành công.

2. **Đăng nhập**

Người dùng đăng nhập bằng email hoặc số điện thoại và mật khẩu. Hệ thống kiểm tra sự tồn tại của tài khoản và xác thực mật khẩu. Nếu thông tin chính xác, hệ thống tạo phiên đăng nhập và cho phép người dùng truy cập vào hệ thống.

3. **Quên mật khẩu**

Trong trường hợp người dùng quên mật khẩu, họ có thể nhập email hoặc số điện thoại đã đăng ký. Hệ thống sẽ gửi mã xác nhận (OTP) để xác thực, sau đó cho phép người dùng đặt lại mật khẩu mới.

4. **Cập nhật thông tin cá nhân**

Người dùng có thể chỉnh sửa các thông tin cá nhân như họ tên, email hoặc số điện thoại. Hệ thống kiểm tra dữ liệu đầu vào và đảm bảo không trùng lặp trước khi cập nhật vào cơ sở dữ liệu.

5. **Đổi mật khẩu**

Người dùng nhập mật khẩu cũ và mật khẩu mới để thay đổi mật khẩu. Hệ thống xác thực mật khẩu cũ và kiểm tra tính hợp lệ của mật khẩu mới trước khi cập nhật.

6. **Đăng xuất**

Người dùng có thể đăng xuất khỏi hệ thống. Hệ thống sẽ xóa phiên đăng nhập hiện tại để đảm bảo an toàn.

7. **Xóa tài khoản**

Người dùng có thể yêu cầu xóa tài khoản. Hệ thống yêu cầu xác nhận và kiểm tra lại thông tin trước khi xóa toàn bộ dữ liệu liên quan đến tài khoản.

---

**Hệ thống usecase và bảng đặc tả**

---

II. **UC VÀ BẢNG ĐẶC TẢ** 

1. **UC01 - Đăng ký và bảng đặc tả**

<img width="975" height="469" alt="image" src="https://github.com/user-attachments/assets/169db646-d9ce-48ed-9948-c772b8915ce6" />


|Thuộc tính|Mô tả|
| :- | :- |
|Tên Use Case|Đăng ký tài khoản|
|Mã Use Case|UC01|
|Mục tiêu|Cho phép người dùng tạo tài khoản mới bnawgf email hoặc sdt|
|Tác nhân chính|Người dùng|
|Mức độ ưu tiên|Cao|
|Tiền điều kiện|<p>- Người dùng chưa đăng nhập </p><p>- Hệ thống hoạt động bình thường</p>|
|Hậu điều kiện|<p>- Tài khoản mới được lưu vào hệ thống </p><p>- Người dùng có thể đăng nhập</p>|
|Luồng sự kiện chính|<p>1. Người dùng nhập email hoặc số điện thoại và mật khẩu.</p><p>2. Người dùng xác nhận đăng ký.</p><p>3. Hệ thống kiểm tra dữ liệu.</p><p>4. Hệ thống kiểm tra định dạng email hoặc số điện thoại.</p><p>5. Hệ thống kiểm tra email hoặc số điện thoại đã tồn tại hay chưa.</p><p>6. Hệ thống kiểm tra mật khẩu hợp lệ.</p><p>7. Hệ thống kiểm tra xác nhận mật khẩu.</p><p>8. Hệ thống lưu tài khoản vào cơ sở dữ liệu.</p><p>9. Hệ thống thông báo đăng ký thành công.</p>|
|Luồng thay thế|<p>- Nếu email hoặc số điện thoại không hợp lệ, hệ thống thông báo lỗi và yêu cầu người dùng nhập lại.</p><p>- Nếu email hoặc số điện thoại đã tồn tại, hệ thống thông báo và yêu cầu sử dụng thông tin khác.</p><p>- Nếu mật khẩu không hợp lệ, hệ thống thông báo lỗi.</p><p>- Nếu mật khẩu xác nhận không khớp, hệ thống yêu cầu nhập lại.</p><p>- Nếu xảy ra lỗi hệ thống, hệ thống thông báo lỗi. </p>|
|Điểm mở rộng|Không có|
|Dữ liệu vào|<p>- Email / SDT</p><p>- Mật khẩu </p><p>- Xác nhận mật khẩu </p>|
|<p>Dữ liệu ra</p><p></p>|Thông báo thành công hoặc lỗi|
|Điều kiện kích hoạt|Người dùng chọn chức năng “Đăng ký”|

---

2. **UC02 –Xác thực tài khoản (đăng nhập + quên mật khẩu) và bảng đặc tả**

<img width="889" height="622" alt="image" src="https://github.com/user-attachments/assets/3dddfc1b-9251-46b4-9d7a-7779fa13841f" />


|Thuộc tính|Mô tả|
| :- | :- |
|Tên Use Case|Xác thực tài khoản|
|Mã Use Case|UC02|
|Mục tiêu|Cho phép người dùng truy cập hệ thống bằng tài khoản đã đăng ký và đổi mật khẩu khi quên |
|Tác nhân chính|Người dùng|
|Mức độ ưu tiên|Cao|
|Tiền điều kiện|Người dùng đã có tài khoản|
|Hậu điều kiện|<p>- Người dùng đăng nhập thành công và có phiên đăng nhập</p><p>- Hoặc mật khẩu được đặt lại thành công</p>|
|Luồng sự kiện chính|<p>1. Người dùng nhập thông tin (email hoặc số điện thoại).</p><p>2. Người dùng nhập mật khẩu.</p><p>3. Người dùng xác nhận đăng nhập.</p><p>4. Hệ thống kiểm tra tài khoản tồn tại.</p><p>5. Hệ thống xác thực mật khẩu.</p><p>6. Hệ thống tạo phiên đăng nhập.</p><p>7. Người dùng truy cập hệ thống.</p>|
|Luồng thay thế (Đăng nhập)|<p>- Nếu tài khoản không tồn tại → hệ thống thông báo lỗi.</p><p>- Nếu mật khẩu sai → hệ thống yêu cầu nhập lại.</p><p>- Người dùng chọn “Quên mật khẩu”.</p>|
|Luồng sự kiện phụ (Quên mật khẩu)|<p>1. Người dùng chọn chức năng “Quên mật khẩu”.</p><p>2. Người dùng nhập email hoặc số điện thoại.</p><p>3. Hệ thống kiểm tra tài khoản tồn tại.</p><p>4. Hệ thống gửi mã xác nhận.</p><p>5. Người dùng nhập mã xác nhận.</p><p>6. Hệ thống xác thực mã.</p><p>7. Người dùng nhập mật khẩu mới.</p><p>8. Hệ thống cập nhật mật khẩu.</p><p>9. Hệ thống thông báo thành công.</p>|
|Luồng thay thế (Quên mật khẩu)|<p>- Email hoặc số điện thoại không tồn tại → thông báo lỗi.</p><p>- Mã xác nhận sai → yêu cầu nhập lại.</p><p>- Mã hết hạn → gửi lại mã.</p><p>- Lỗi hệ thống → thông báo lỗi.</p>|
|Điểm mở rộng|Quên mật khẩu|
|Dữ liệu vào|<p>- Email hoặc số điện thoại</p><p>- Mật khẩu</p><p>- Mã xác nhận (OTP)</p><p>- Mật khẩu mới</p>|
|<p>Dữ liệu ra</p><p></p>|<p>- Trạng thái đăng nhập</p><p>- Thông báo kết quả</p>|
|Điều kiện kích hoạt|Người dùng chọn “Đăng nhập” hoặc “Quên mật khẩu”|

---

3. **UC03 – Cập nhật thông tin cá nhân và bảng đặc tả**

<img width="906" height="455" alt="image" src="https://github.com/user-attachments/assets/31741481-24f5-4501-9ac3-53f6d9aff704" />


|Thuộc tính|Mô tả|
| :- | :- |
|Tên Use Case|Cập nhật thông tin |
|Mã Use Case|UC03|
|Mục tiêu|Cho phép người dùng chỉnh sửa thông tin cá nhân trong hệ thống|
|Tác nhân chính|Người dùng |
|Mức độ ưu tiên|Trung bình|
|Tiền điều kiện|Người dùng đã đăng nhập hệ thống|
|Hậu điều kiện|Thông tin tài khoản được cập nhật trong hệ thống|
|Luồng sự kiện chính|<p>1. Người dùng nhập thông tin mới (họ tên, email, số điện thoại).</p><p>2. Người dùng xác nhận cập nhật.</p><p>3. Hệ thống kiểm tra dữ liệu.</p><p>4. Hệ thống kiểm tra định dạng email hoặc số điện thoại.</p><p>5. Hệ thống kiểm tra trùng email hoặc số điện thoại.</p><p>6. Nếu có thay đổi email hoặc số điện thoại, hệ thống gửi mã OTP.</p><p>7. Người dùng nhập mã OTP.</p><p>8. Hệ thống xác thực OTP.</p><p>9. Hệ thống cập nhật dữ liệu vào cơ sở dữ liệu.</p><p>10. Hệ thống thông báo cập nhật thành công.</p>|
|Luồng thay thế|<p>- Dữ liệu không hợp lệ → hệ thống yêu cầu nhập lại.</p><p>- Email hoặc số điện thoại đã tồn tại → không cho cập nhật.</p><p>- Mã OTP sai → yêu cầu nhập lại.</p><p>- Mã OTP hết hạn → hệ thống gửi lại mã.</p><p>- Lỗi hệ thống → thông báo lỗi.</p>|
|Điểm mở rộng|Không có|
|Dữ liệu vào|<p>- Họ tên </p><p>- Email </p><p>- SĐT  </p><p>- Mã OTP</p>|
|<p>Dữ liệu ra</p><p></p>|Thông tin đã cập nhật|
|Điều kiện kích hoạt|Người dùng chọn "Cập nhật thông tin"|

---

4. **UC04 – Đổi Mật Khẩu và Bảng Đặc Tả**

<img width="948" height="494" alt="image" src="https://github.com/user-attachments/assets/5914b958-11a1-43f0-a7c2-63f2b24b805c" />


|Thuộc tính|Mô tả|
| :- | :- |
|Tên Use Case|Đổi mật khẩu|
|Mã Use Case|UC04|
|Mục tiêu|Cho phép người dùng thay đổi mật khẩu tài khoản. Hệ thống yêu cầu xác thực mật khẩu cũ và xác thực OTP để đảm bảo bảo mật.|
|Tác nhân chính|Người dùng |
|Mức độ ưu tiên|Cao|
|Tiền điều kiện|Người dùng đã đăng nhập |
|Hậu điều kiện|Mật khẩu mới được cập nhật thành công|
|Luồng sự kiện chính|<p>1. Người dùng nhập mật khẩu cũ.</p><p>2. Người dùng nhập mật khẩu mới.</p><p>3. Người dùng xác nhận đổi mật khẩu.</p><p>4. Hệ thống kiểm tra mật khẩu cũ.</p><p>5. Hệ thống kiểm tra mật khẩu mới hợp lệ.</p><p>6. Hệ thống kiểm tra xác nhận mật khẩu mới.</p><p>7. Hệ thống gửi mã OTP.</p><p>8. Người dùng nhập mã OTP.</p><p>9. Hệ thống xác thực OTP.</p><p>10. Hệ thống cập nhật mật khẩu mới.</p><p>11. Hệ thống thông báo đổi mật khẩu thành công.</p>|
|Luồng thay thế|<p>- Mật khẩu cũ không đúng → thông báo lỗi.</p><p>- Mật khẩu mới không hợp lệ → yêu cầu nhập lại.</p><p>- Mật khẩu xác nhận không khớp → yêu cầu nhập lại.</p><p>- Mã OTP sai → yêu cầu nhập lại.</p><p>- Mã OTP hết hạn → gửi lại mã.</p><p>- Lỗi hệ thống → thông báo lỗi.</p>|
|Điểm mở rộng|Không có|
|Dữ liệu vào|<p>- Mật khẩu cũ </p><p>- Mật khẩu mới</p><p>- Xác nhận mật khẩu </p><p>- Mã OTP</p>|
|<p>Dữ liệu ra</p><p></p>|Thông báo kết quả|
|Điều kiện kích hoạt|Người dùng chọn “Đổi mật khẩu”|

---

5. **UC05 – Đăng xuất và bảng đặc tả**

<img width="889" height="500" alt="image" src="https://github.com/user-attachments/assets/8cf35e33-9b56-4b60-af7f-17d3077b3621" />


|Thuộc tính|Mô tả|
| :- | :- |
|Tên Use Case|Đăng xuất|
|Mã Use Case|UC05|
|Mục tiêu|Cho phép người dùng đăng xuất khỏi hệ thống và kết thúc phiên làm việc hiện tại.|
|Tác nhân chính|Người dùng |
|Mức độ ưu tiên|Trung bình|
|Tiền điều kiện|Người dùng đã đăng nhập |
|Hậu điều kiện|Phiên đăng nhập của người dùng bị xóa và người dùng được chuyển về màn hình đăng nhập.|
|Luồng sự kiện chính|<p>1. Người dùng chọn chức năng “Đăng xuất”.</p><p>2. Hệ thống kiểm tra phiên đăng nhập.</p><p>3. Hệ thống xóa phiên đăng nhập.</p><p>4. Hệ thống chuyển người dùng về màn hình đăng nhập.</p>|
|Luồng thay thế|<p>- Không tồn tại phiên đăng nhập → hệ thống vẫn chuyển về màn hình đăng nhập.</p><p>- Lỗi hệ thống → thông báo lỗi.</p>|
|Điểm mở rộng|Không có|
|Dữ liệu vào|Không có|
|<p>Dữ liệu ra</p><p></p>|Trạng thái đăng xuất|
|Điều kiện kích hoạt|Người dùng chọn “Đăng xuất”|

---

6. **UC06 – Xóa tài khoản và bảng đặc tả**

<img width="892" height="488" alt="image" src="https://github.com/user-attachments/assets/99101edb-3ea5-49e5-b0a9-5c063dc7141e" />


|Thuộc tính|Mô tả|
| :- | :- |
|Tên Use Case|Đăng xuất|
|Mã Use Case|UC05|
|Mục tiêu|Cho phép người dùng xóa tài khoản khỏi hệ thống. Để đảm bảo an toàn, hệ thống yêu cầu xác thực mật khẩu và mã OTP trước khi thực hiện xóa.|
|Tác nhân chính|Người dùng |
|Mức độ ưu tiên|Cao|
|Tiền điều kiện|Người dùng đã đăng nhập |
|Hậu điều kiện|Tài khoản của người dùng bị xóa khỏi hệ thống và không thể đăng nhập lại.|
|Luồng sự kiện chính|<p>1. Người dùng chọn chức năng “Xóa tài khoản”.</p><p>2. Người dùng xác nhận yêu cầu xóa tài khoản.</p><p>3. Hệ thống yêu cầu nhập mật khẩu.</p><p>4. Hệ thống kiểm tra mật khẩu.</p><p>5. Hệ thống gửi mã OTP.</p><p>6. Người dùng nhập mã OTP.</p><p>7. Hệ thống xác thực OTP.</p><p>8. Hệ thống xóa dữ liệu tài khoản.</p><p>9. Hệ thống thông báo xóa tài khoản thành công.</p>|
|Luồng thay thế|<p>- Mật khẩu không đúng → thông báo lỗi.</p><p>- Mã OTP sai → yêu cầu nhập lại.</p><p>- Mã OTP hết hạn → gửi lại mã.</p><p>- Người dùng hủy thao tác → dừng quá trình.</p><p>- Lỗi hệ thống → thông báo lỗi.</p>|
|Điểm mở rộng|Không có|
|Dữ liệu vào|<p>- Mật khẩu</p><p>- Mã OTP</p>|
|<p>Dữ liệu ra</p><p></p>|Trạng thái xóa tài khoản|
|Điều kiện kích hoạt|Người dùng chọn “Xóa tài khoản”|

---

III. **Biểu đồ hoạt động**

1. **Đăng Ký**
<img width="975" height="975" alt="image" src="https://github.com/user-attachments/assets/4b28ceca-5fe0-4a19-8d40-1c647d0dad4c" />

2. **Đăng Nhập**
<img width="850" height="667" alt="image" src="https://github.com/user-attachments/assets/c8a9c0f3-9de0-4aa0-b998-27b88c4e45b7" />

3. **Quên mật khẩu**
<img width="667" height="742" alt="image" src="https://github.com/user-attachments/assets/415ae8bd-095c-489d-b48d-3f69e523295c" />

4. **Cập nhật thông tin**
<img width="838" height="836" alt="image" src="https://github.com/user-attachments/assets/8b4c3bed-acfd-4ca4-92d4-e3fe70501968" />

5. **Đổi mật khẩu**
<img width="805" height="903" alt="image" src="https://github.com/user-attachments/assets/3bd59d58-6288-4b19-8888-85143420e1e3" />

6. **Đăng xuất**
<img width="214" height="411" alt="image" src="https://github.com/user-attachments/assets/4f5171b5-303b-4b54-bc3a-425662e91737" />

7. **Xóa tài khoản**
<img width="542" height="741" alt="image" src="https://github.com/user-attachments/assets/07c8cbff-d4fd-4244-937a-7f31f1dbb1c5" />
