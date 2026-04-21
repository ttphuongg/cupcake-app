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

II.  **UC VÀ BẢNG ĐẶC TẢ**

<!-- -->

1.  **UC01 - Đăng ký và bảng đặc tả**

<img width="858" height="541" alt="image" src="https://github.com/user-attachments/assets/86ec51f6-7a0b-4901-b671-27ff3e2c145b" />


<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Thuộc tính</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Tên Use Case</td>
<td>Đăng ký tài khoản</td>
</tr>
<tr class="even">
<td>Mã Use Case</td>
<td>UC01</td>
</tr>
<tr class="odd">
<td>Mục tiêu</td>
<td>Cho phép người dùng tạo tài khoản mới bằng email hoặc sdt</td>
</tr>
<tr class="even">
<td>Tác nhân chính</td>
<td>Người dùng</td>
</tr>
<tr class="odd">
<td>Mức độ ưu tiên</td>
<td>Cao</td>
</tr>
<tr class="even">
<td>Tiền điều kiện</td>
<td><ul>
<li><p>Người dùng chưa đăng nhập</p></li>
<li><p>Hệ thống hoạt động bình thường</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>Hậu điều kiện</td>
<td><ul>
<li><p>Tài khoản mới được lưu vào hệ thống</p></li>
</ul>
<ul>
<li><p>Người dùng có thể đăng nhập</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Luồng sự kiện chính</td>
<td><ol type="1">
<li><p>Người dùng nhập email/SĐT và mật khẩu.</p></li>
<li><p>Người dùng xác nhận đăng ký.</p></li>
<li><p>Hệ thống kiểm tra tính hợp lệ của dữ liệu.</p></li>
<li><p>Hệ thống kiểm tra tài khoản đã tồn tại hay chưa.</p></li>
<li><p>Hệ thống tạo tài khoản mới.</p></li>
<li><p>Hệ thống thông báo đăng ký thành công.</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>Luồng thay thế</td>
<td><ul>
<li><p>Nếu email hoặc số điện thoại không hợp lệ, hệ thống thông báo lỗi và yêu cầu người dùng nhập lại.</p></li>
<li><p>Nếu email hoặc số điện thoại đã tồn tại, hệ thống thông báo và yêu cầu sử dụng thông tin khác.</p></li>
<li><p>Nếu mật khẩu không hợp lệ, hệ thống thông báo lỗi.</p></li>
<li><p>Nếu mật khẩu xác nhận không khớp, hệ thống yêu cầu nhập lại.</p></li>
<li><p>Nếu xảy ra lỗi hệ thống, hệ thống thông báo lỗi.</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Điểm mở rộng</td>
<td>Không có</td>
</tr>
<tr class="odd">
<td>Dữ liệu vào</td>
<td><ul>
<li><p>Email / SDT</p></li>
<li><p>Mật khẩu</p></li>
<li><p>Xác nhận mật khẩu</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Dữ liệu ra</td>
<td>Thông báo thành công hoặc lỗi</td>
</tr>
<tr class="odd">
<td>Điều kiện kích hoạt</td>
<td>Người dùng chọn chức năng “Đăng ký”</td>
</tr>
</tbody>
</table>

---

2.  **UC02 --Xác thực tài khoản (đăng nhập + quên mật khẩu) và bảng đặc tả**

<img width="975" height="498" alt="image" src="https://github.com/user-attachments/assets/089b58d2-3c08-408c-85dc-233c2c2bfe83" />


<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Thuộc tính</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Tên Use Case</td>
<td>Xác thực tài khoản</td>
</tr>
<tr class="even">
<td>Mã Use Case</td>
<td>UC02</td>
</tr>
<tr class="odd">
<td>Mục tiêu</td>
<td>Cho phép người dùng truy cập hệ thống bằng tài khoản đã đăng ký và đổi mật khẩu khi quên</td>
</tr>
<tr class="even">
<td>Tác nhân chính</td>
<td>Người dùng</td>
</tr>
<tr class="odd">
<td>Mức độ ưu tiên</td>
<td>Cao</td>
</tr>
<tr class="even">
<td>Tiền điều kiện</td>
<td><ul>
<li><p>Người dùng có tài khoản trong hệ thống</p></li>
<li><p>Hệ thống hoạt động bình thường</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>Hậu điều kiện</td>
<td><ul>
<li><p>Người dùng đăng nhập thành công và có phiên đăng nhập</p></li>
<li><p>Hoặc mật khẩu được đặt lại thành công</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Luồng sự kiện chính</td>
<td><ol type="1">
<li><p>Người dùng nhập thông tin (email hoặc số điện thoại).</p></li>
<li><p>Người dùng nhập mật khẩu.</p></li>
<li><p>Người dùng xác nhận đăng nhập.</p></li>
<li><p>Hệ thống kiểm tra tài khoản tồn tại.</p></li>
<li><p>Hệ thống xác thực mật khẩu.</p></li>
<li><p>Hệ thống tạo phiên đăng nhập.</p></li>
<li><p>Người dùng truy cập hệ thống.</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>Luồng thay thế (Đăng nhập)</td>
<td><ul>
<li><p>Nếu tài khoản không tồn tại → hệ thống thông báo lỗi.</p></li>
<li><p>Nếu mật khẩu sai → hệ thống yêu cầu nhập lại.</p></li>
<li><p>Người dùng chọn “Quên mật khẩu”.</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Luồng sự kiện phụ (Quên mật khẩu)</td>
<td><ol type="1">
<li><p>Người dùng chọn chức năng “Quên mật khẩu”.</p></li>
<li><p>Người dùng nhập email hoặc số điện thoại.</p></li>
<li><p>Hệ thống kiểm tra tài khoản tồn tại.</p></li>
<li><p>Hệ thống gửi mã xác nhận.</p></li>
<li><p>Người dùng nhập mã xác nhận.</p></li>
<li><p>Hệ thống xác thực mã.</p></li>
<li><p>Người dùng nhập mật khẩu mới.</p></li>
<li><p>Hệ thống cập nhật mật khẩu.</p></li>
<li><p>Hệ thống thông báo thành công.</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>Luồng thay thế (Quên mật khẩu)</td>
<td><ul>
<li><p>Email hoặc số điện thoại không tồn tại → thông báo lỗi.</p></li>
<li><p>Mã xác nhận sai → yêu cầu nhập lại.</p></li>
<li><p>Mã hết hạn → gửi lại mã.</p></li>
<li><p>Lỗi hệ thống → thông báo lỗi.</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Điểm mở rộng</td>
<td>Quên mật khẩu</td>
</tr>
<tr class="odd">
<td>Dữ liệu vào</td>
<td><ul>
<li><p>Email hoặc số điện thoại</p></li>
<li><p>Mật khẩu</p></li>
<li><p>Mã xác nhận (OTP)</p></li>
<li><p>Mật khẩu mới</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Dữ liệu ra</td>
<td><ul>
<li><p>Trạng thái đăng nhập</p></li>
<li><p>Thông báo kết quả</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>Điều kiện kích hoạt</td>
<td>Người dùng chọn “Đăng nhập” hoặc “Quên mật khẩu”</td>
</tr>
</tbody>
</table>

---

3.  **UC03 -- Cập nhật thông tin cá nhân và bảng đặc tả**

<img width="784" height="497" alt="image" src="https://github.com/user-attachments/assets/f46ea37f-4b6b-4c17-94e6-06b100908091" />


<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Thuộc tính</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Tên Use Case</td>
<td>Cập nhật thông tin</td>
</tr>
<tr class="even">
<td>Mã Use Case</td>
<td>UC03</td>
</tr>
<tr class="odd">
<td>Mục tiêu</td>
<td>Cho phép người dùng chỉnh sửa thông tin cá nhân trong hệ thống</td>
</tr>
<tr class="even">
<td>Tác nhân chính</td>
<td>Người dùng</td>
</tr>
<tr class="odd">
<td>Mức độ ưu tiên</td>
<td>Trung bình</td>
</tr>
<tr class="even">
<td>Tiền điều kiện</td>
<td>Người dùng đã đăng nhập hệ thống</td>
</tr>
<tr class="odd">
<td>Hậu điều kiện</td>
<td>Thông tin tài khoản được cập nhật trong hệ thống</td>
</tr>
<tr class="even">
<td>Luồng sự kiện chính</td>
<td><ol type="1">
<li><p>Người dùng nhập thông tin mới (họ tên, email, số điện thoại).</p></li>
<li><p>Người dùng xác nhận cập nhật.</p></li>
<li><p>Hệ thống kiểm tra tính hợp lệ của dữ liệu.</p></li>
<li><p>Hệ thống kiểm tra email hoặc số điện thoại đã tồn tại hay chưa.</p></li>
<li><p>Nếu có thay đổi email hoặc số điện thoại, hệ thống gửi mã OTP.</p></li>
<li><p>Người dùng nhập mã OTP.</p></li>
<li><p>Hệ thống xác thực OTP.</p></li>
<li><p>Hệ thống cập nhật thông tin.</p></li>
<li><p>Hệ thống thông báo cập nhật thành công.</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>Luồng thay thế</td>
<td><ul>
<li><p>Dữ liệu không hợp lệ → hệ thống yêu cầu nhập lại.</p></li>
<li><p>Email hoặc số điện thoại đã tồn tại → không cho cập nhật.</p></li>
<li><p>Mã OTP sai → yêu cầu nhập lại.</p></li>
<li><p>Mã OTP hết hạn → hệ thống gửi lại mã.</p></li>
<li><p>Lỗi hệ thống → thông báo lỗi.</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Điểm mở rộng</td>
<td>Không có</td>
</tr>
<tr class="odd">
<td>Dữ liệu vào</td>
<td><ul>
<li><p>Họ tên</p></li>
<li><p>Email</p></li>
<li><p>SĐT</p></li>
<li><p>Mã OTP</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Dữ liệu ra</td>
<td>Thông tin đã cập nhật</td>
</tr>
<tr class="odd">
<td>Điều kiện kích hoạt</td>
<td>Người dùng chọn "Cập nhật thông tin"</td>
</tr>
</tbody>
</table>

---

4.  **UC04 -- Đổi Mật Khẩu và Bảng Đặc Tả**

<img width="844" height="451" alt="image" src="https://github.com/user-attachments/assets/97b33745-963c-4ac6-b82d-abdb75c33066" />


<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Thuộc tính</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Tên Use Case</td>
<td>Đổi mật khẩu</td>
</tr>
<tr class="even">
<td>Mã Use Case</td>
<td>UC04</td>
</tr>
<tr class="odd">
<td>Mục tiêu</td>
<td>Cho phép người dùng thay đổi mật khẩu tài khoản. Hệ thống yêu cầu xác thực mật khẩu cũ và xác thực OTP để đảm bảo bảo mật.</td>
</tr>
<tr class="even">
<td>Tác nhân chính</td>
<td>Người dùng</td>
</tr>
<tr class="odd">
<td>Mức độ ưu tiên</td>
<td>Cao</td>
</tr>
<tr class="even">
<td>Tiền điều kiện</td>
<td>Người dùng đã đăng nhập</td>
</tr>
<tr class="odd">
<td>Hậu điều kiện</td>
<td>Mật khẩu mới được cập nhật thành công</td>
</tr>
<tr class="even">
<td>Luồng sự kiện chính</td>
<td><ol type="1">
<li><p>Người dùng chọn chức năng "Đổi mật khẩu".</p></li>
<li><p>Hệ thống hiển thị form yêu cầu nhập mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu mới.</p></li>
<li><p>Người dùng nhập đầy đủ thông tin và nhấn "Xác nhận".</p></li>
<li><p>Hệ thống kiểm tra tính hợp lệ của dữ liệu (mật khẩu cũ đúng, mật khẩu mới đúng định dạng).</p></li>
<li><p>Hệ thống gửi mã OTP về số điện thoại/email của người dùng.</p></li>
<li><p>Người dùng nhập mã OTP nhận được.</p></li>
<li><p>Hệ thống xác thực mã OTP.</p></li>
<li><p>Hệ thống cập nhật mật khẩu mới vào cơ sở dữ liệu và thông báo thành công.</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>Luồng thay thế</td>
<td><ul>
<li><p>Mật khẩu cũ không đúng → thông báo lỗi.</p></li>
<li><p>Mật khẩu mới không hợp lệ → yêu cầu nhập lại.</p></li>
<li><p>Mật khẩu xác nhận không khớp → yêu cầu nhập lại.</p></li>
<li><p>Mã OTP sai → yêu cầu nhập lại.</p></li>
<li><p>Mã OTP hết hạn → gửi lại mã.</p></li>
<li><p>Lỗi hệ thống → thông báo lỗi.</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Điểm mở rộng</td>
<td>Không có</td>
</tr>
<tr class="odd">
<td>Dữ liệu vào</td>
<td><ul>
<li><p>Mật khẩu cũ</p></li>
<li><p>Mật khẩu mới</p></li>
<li><p>Xác nhận mật khẩu</p></li>
<li><p>Mã OTP</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Dữ liệu ra</td>
<td>Thông báo kết quả</td>
</tr>
<tr class="odd">
<td>Điều kiện kích hoạt</td>
<td>Người dùng chọn “Đổi mật khẩu”</td>
</tr>
</tbody>
</table>

---

5.  **UC05 -- Đăng xuất và bảng đặc tả**

<img width="591" height="312" alt="image" src="https://github.com/user-attachments/assets/b1420146-dcb9-409c-8db1-6ae3a54100a3" />


<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Thuộc tính</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Tên Use Case</td>
<td>Đăng xuất</td>
</tr>
<tr class="even">
<td>Mã Use Case</td>
<td>UC05</td>
</tr>
<tr class="odd">
<td>Mục tiêu</td>
<td>Cho phép người dùng đăng xuất khỏi hệ thống và kết thúc phiên làm việc hiện tại.</td>
</tr>
<tr class="even">
<td>Tác nhân chính</td>
<td>Người dùng</td>
</tr>
<tr class="odd">
<td>Mức độ ưu tiên</td>
<td>Trung bình</td>
</tr>
<tr class="even">
<td>Tiền điều kiện</td>
<td>Người dùng đã đăng nhập</td>
</tr>
<tr class="odd">
<td>Hậu điều kiện</td>
<td>Người dùng thoát khỏi hệ thống thành công, mọi phiên làm việc bị hủy.</td>
</tr>
<tr class="even">
<td>Luồng sự kiện chính</td>
<td><ol type="1">
<li><p>Người dùng nhấn chọn nút "Đăng xuất".</p></li>
<li><p>Hệ thống yêu cầu xác nhận đăng xuất</p></li>
<li><p>Người dùng xác nhận.</p></li>
<li><p>Hệ thống thực hiện xóa phiên làm việc của người dùng.</p></li>
<li><p>Hệ thống điều hướng người dùng về màn hình đăng nhập và hiển thị thông báo</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>Luồng thay thế</td>
<td><ul>
<li><p>Không tồn tại phiên đăng nhập → hệ thống chuyển về màn hình đăng nhập.</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Điểm mở rộng</td>
<td>Không có</td>
</tr>
<tr class="odd">
<td>Dữ liệu vào</td>
<td>Không có</td>
</tr>
<tr class="even">
<td>Dữ liệu ra</td>
<td>Trạng thái đăng xuất</td>
</tr>
<tr class="odd">
<td>Điều kiện kích hoạt</td>
<td>Người dùng chọn “Đăng xuất”</td>
</tr>
</tbody>
</table>

---

6.  **UC06 -- Xóa tài khoản và bảng đặc tả**

<img width="562" height="406" alt="image" src="https://github.com/user-attachments/assets/2eb2ad56-ab48-4e69-a053-42d424dd8dc7" />


<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th>Thuộc tính</th>
<th>Mô tả</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Tên Use Case</td>
<td>Xóa tài khoản</td>
</tr>
<tr class="even">
<td>Mã Use Case</td>
<td>UC06</td>
</tr>
<tr class="odd">
<td>Mục tiêu</td>
<td>Cho phép người dùng xóa tài khoản khỏi hệ thống. Để đảm bảo an toàn, hệ thống yêu cầu xác thực mật khẩu và mã OTP trước khi thực hiện xóa.</td>
</tr>
<tr class="even">
<td>Tác nhân chính</td>
<td>Người dùng</td>
</tr>
<tr class="odd">
<td>Mức độ ưu tiên</td>
<td>Cao</td>
</tr>
<tr class="even">
<td>Tiền điều kiện</td>
<td>Người dùng đã đăng nhập</td>
</tr>
<tr class="odd">
<td>Hậu điều kiện</td>
<td>Tài khoản của người dùng bị xóa khỏi hệ thống và không thể đăng nhập lại.</td>
</tr>
<tr class="even">
<td>Luồng sự kiện chính</td>
<td><ol type="1">
<li><p>Người dùng chọn chức năng "Xóa tài khoản" trong phần cài đặt tài khoản.</p></li>
<li><p>Hệ thống hiển thị màn hình cảnh báo về việc mất dữ liệu sau khi xóa và yêu cầu người dùng xác nhận.</p></li>
<li><p>Người dùng nhấn nút "Xác nhận xóa".</p></li>
<li><p>Hệ thống yêu cầu người dùng nhập mật khẩu hiện tại để xác minh danh tính.</p></li>
<li><p>Người dùng nhập mật khẩu và nhấn "Tiếp tục".</p></li>
<li><p>Hệ thống kiểm tra mật khẩu. Nếu đúng, hệ thống thực hiện Use Case: Xác thực OTP</p></li>
<li><p>Người dùng nhập mã OTP nhận được và xác nhận trên hệ thống.</p></li>
<li><p>Hệ thống xác thực mã OTP thành công và tiến hành xóa dữ liệu tài khoản trong cơ sở dữ liệu.</p></li>
<li><p>Hệ thống tự động đăng xuất người dùng, điều hướng về trang chủ và hiển thị thông báo "Xóa tài khoản thành công".</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>Luồng thay thế</td>
<td><ul>
<li><p>Mật khẩu không đúng → thông báo lỗi.</p></li>
<li><p>Mã OTP sai → yêu cầu nhập lại.</p></li>
<li><p>Mã OTP hết hạn → gửi lại mã.</p></li>
<li><p>Người dùng hủy thao tác → dừng quá trình.</p></li>
<li><p>Lỗi hệ thống → thông báo lỗi.</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Điểm mở rộng</td>
<td>Không có</td>
</tr>
<tr class="odd">
<td>Dữ liệu vào</td>
<td><ul>
<li><p>Mật khẩu</p></li>
<li><p>Mã OTP</p></li>
</ul></td>
</tr>
<tr class="even">
<td>Dữ liệu ra</td>
<td>Trạng thái xóa tài khoản</td>
</tr>
<tr class="odd">
<td>Điều kiện kích hoạt</td>
<td>Người dùng chọn “Xóa tài khoản”</td>
</tr>
</tbody>
</table>

---

III. **Biểu đồ hoạt động**

<!-- -->

1.  **Đăng Ký**

<img width="975" height="975" alt="image" src="https://github.com/user-attachments/assets/43df9492-b9ec-4f36-9543-de201283d11e" />

---

2.  **Đăng Nhập**

<img width="850" height="667" alt="image" src="https://github.com/user-attachments/assets/7e6e6af4-bb22-4031-8d69-9ccede182809" />

---

3.  **Quên mật khẩu**

<img width="667" height="742" alt="image" src="https://github.com/user-attachments/assets/656f38fd-f832-4279-b4d9-d8de3ac6f1c7" />

---

4.  **Cập nhật thông tin**

<img width="838" height="836" alt="image" src="https://github.com/user-attachments/assets/6edcca03-ae8a-4604-a0e8-29ad3151000f" />

--

5.  **Đổi mật khẩu**

<img width="805" height="903" alt="image" src="https://github.com/user-attachments/assets/5ed0053f-9df1-4902-ad3f-50535289e71f" />

---

6.  **Đăng xuất**

<img width="214" height="411" alt="image" src="https://github.com/user-attachments/assets/5d074473-8264-4e60-b197-7a920f167a2d" />

---

7.  **Xóa tài khoản**

<img width="542" height="741" alt="image" src="https://github.com/user-attachments/assets/7b7f7714-4ebb-4f3c-b636-32dbc3bbba6a" />

