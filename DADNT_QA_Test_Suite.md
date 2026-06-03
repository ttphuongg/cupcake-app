# 🧁 DADNT Cupcake App — Complete QA Test Suite

> **Project:** Cupcake App (React Native Mobile + Node.js/Express Backend + Vite Admin)  
> **Prepared by:** Senior QA Engineer (AI-assisted analysis)  
> **Date:** 2026-05-31  
> **Total Test Cases:** 210+

---

## 📌 System Overview

| Layer | Technology | Key Areas |
|---|---|---|
| Mobile App | React Native / Expo Router | Auth, Home, Cart, Checkout, Orders, Profile, Design |
| Backend API | Node.js / Express / TypeScript | 12 route groups, JWT auth, MySQL |
| Admin Panel | React / Vite | Login, Dashboard, Order management |
| Database | MySQL | Users, Orders, Products, Reviews, Cart, OTPs, Ingredients |

---

## 📋 MODULE 1: Authentication

### Functional Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| AUTH-F-001 | Authentication | User Registration | App is running, DB connected | 1. Navigate to Register screen 2. Enter valid name 3. Enter valid email 4. Enter valid phone 5. Enter valid password 6. Enter matching confirm password 7. Tap Register | name="Nguyen Van A", email="test@gmail.com", phone="0912345678", password="Pass@123" | Registration succeeds, auto-login, redirect to /(tabs), success alert shown | High |
| AUTH-F-002 | Authentication | User Registration (no phone) | App is running | 1. Navigate to Register screen 2. Enter name, email, password, confirmPassword 3. Leave phone blank 4. Tap Register | name="Test User", email="test2@gmail.com", phone="", password="Pass@123" | Registration succeeds without phone | Medium |
| AUTH-F-003 | Authentication | Login with Email | User account exists | 1. Navigate to Login screen 2. Enter registered email 3. Enter correct password 4. Tap Login | identifier="test@gmail.com", password="Pass@123" | JWT token received, redirect to home screen | High |
| AUTH-F-004 | Authentication | Login with Phone | User account with phone exists | 1. Navigate to Login screen 2. Enter registered phone 3. Enter correct password 4. Tap Login | identifier="0912345678", password="Pass@123" | Login succeeds, JWT token received | High |
| AUTH-F-005 | Authentication | Forgot Password Email Sent | User account exists | 1. Navigate to Forgot Password screen 2. Enter registered email 3. Tap Send | email="test@gmail.com" | Success message shown, email dispatched within 15 mins, UI switches to success state showing the email address | High |
| AUTH-F-006 | Authentication | Reset Password via Link | Valid reset token exists (< 15 min old) | 1. Open reset link from email 2. Browser redirects to Expo Go deep link 3. Enter new password 4. Confirm new password 5. Submit | token=valid_hex, newPassword="NewPass@456" | Password updated, token cleared from DB, old token no longer works | High |
| AUTH-F-007 | Authentication | Logout | User is logged in | 1. Navigate to Profile tab 2. Tap Logout 3. Confirm in dialog | - | User session cleared, redirect to /login | High |
| AUTH-F-008 | Authentication | Auto-login after Registration | - | 1. Complete registration 2. Observe redirect | - | User is automatically logged in and navigated to home, no manual login required | Medium |

### Negative Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| AUTH-N-001 | Authentication | Register Duplicate Email | Email already registered | 1. Register with existing email | email="test@gmail.com" (existing) | Error: "Email này đã được sử dụng" (400) | High |
| AUTH-N-002 | Authentication | Register Duplicate Phone | Phone already registered | 1. Register with existing phone number | phone="0912345678" (existing) | Error: "Số điện thoại này đã được sử dụng" (400) | High |
| AUTH-N-003 | Authentication | Login Wrong Password | Account exists | 1. Enter correct email 2. Enter wrong password | password="WrongPass" | Error: "Mật khẩu không chính xác", password field highlighted | High |
| AUTH-N-004 | Authentication | Login Non-existent Account | - | 1. Enter email that doesn't exist | identifier="nobody@test.com" | Error: "Tài khoản không tồn tại", identifier field highlighted | High |
| AUTH-N-005 | Authentication | Forgot Password Unknown Email | - | 1. Enter unregistered email | email="nobody@nowhere.com" | Error: "Tài khoản không tồn tại" (400) | High |
| AUTH-N-006 | Authentication | Expired Reset Token | Token > 15 min old | 1. Attempt to verify expired reset token | token=expired_token | Error: "Đường dẫn đặt lại mật khẩu đã hết hạn (hiệu lực 15 phút)" | High |
| AUTH-N-007 | Authentication | Invalid Reset Token | - | 1. POST /auth/reset-password with fake token | token="aaabbbccc111222" | Error: "Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng" | High |
| AUTH-N-008 | Authentication | Used Reset Token (one-time use) | Token used once | 1. Reuse same token after successful reset | token=already_used_token | Error: token not found in DB | High |
| AUTH-N-009 | Authentication | Rate Limit on Forgot Password | Sent request < 2 min ago | 1. Send second forgot-password request within 2 minutes | email="test@gmail.com" | Error: "Bạn vừa yêu cầu... Vui lòng đợi X giây" | Medium |
| AUTH-N-010 | Authentication | Register Missing Email | - | 1. Submit without email | name="Test", password="Pass@123" | Error: "Email, mật khẩu và họ tên là bắt buộc" (400) | High |
| AUTH-N-011 | Authentication | Register Missing Password | - | 1. Submit without password | email="a@b.com", name="Test" | Error (400) returned | High |
| AUTH-N-012 | Authentication | Register Mismatched Passwords | - | 1. Enter different password and confirm | password="Pass@123", confirmPassword="Pass@456" | Client-side error: "Mật khẩu không khớp" | High |
| AUTH-N-013 | Authentication | Forgot Password Empty Email | - | 1. Submit with empty email | email="" | Error: "Email là bắt buộc" (400) | Medium |

### Boundary Value Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| AUTH-B-001 | Authentication | Phone Validation — valid boundary | - | Enter phone starting with valid prefix | phone="0312345678" (03x) | Accepted as valid | Medium |
| AUTH-B-002 | Authentication | Phone Validation — invalid prefix | - | Enter phone with invalid prefix | phone="0112345678" (01x) | Client error: phone invalid | Medium |
| AUTH-B-003 | Authentication | Phone Validation — 9 digits | - | Enter 9-digit phone number | phone="091234567" | Client error: phone invalid | Medium |
| AUTH-B-004 | Authentication | Phone Validation — 11 digits | - | Enter 11-digit phone number | phone="09123456789" | Client error: phone invalid | Medium |
| AUTH-B-005 | Authentication | Reset Token Expiry — exactly 15 min | - | Use token at exactly 15 min mark | token expires at T+15:00 | Should be rejected (expired) | Medium |
| AUTH-B-006 | Authentication | Rate Limit — exactly 2 min wait | - | Send request exactly 2 min after first | timestamp = first_req + 120s | Should succeed (cooldown cleared) | Medium |

---

## 📋 MODULE 2: User Profile

### Functional Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| PROF-F-001 | User Profile | Get Profile | User logged in | 1. Navigate to Profile tab 2. Observe profile data | Auth token in headers | User name, email, phone, address, avatar_url displayed; password NOT returned | High |
| PROF-F-002 | User Profile | Update Profile Name | User logged in, edit mode | 1. Tap Edit 2. Change name 3. Save | name="Nguyen Van B" | Profile updated, success alert | High |
| PROF-F-003 | User Profile | Update Profile Address | User logged in, edit mode | 1. Tap Edit 2. Change address 3. Save | address="123 Nguyen Hue, Q1, HCM" | Address saved successfully | Medium |
| PROF-F-004 | User Profile | Upload Avatar | User logged in | 1. Tap avatar 2. Pick image from gallery 3. Observe upload | JPEG image < 5MB | Avatar uploaded, URL stored, profile avatar updated | Medium |
| PROF-F-005 | User Profile | Change Password Flow | User logged in | 1. Tap Change Password 2. Request link 3. Open email link 4. Enter new password 5. Submit | newPassword="NewPass@789" | Password changed, token cleared, redirect to app | High |
| PROF-F-006 | User Profile | Delete Account Flow | User logged in | 1. Tap Delete Account 2. Enter correct password 3. Request link 4. Open email link 5. Confirm | password="current_password" | Account and all data deleted permanently | High |
| PROF-F-007 | User Profile | Logout Confirmation Dialog | User logged in | 1. Tap Logout 2. Observe confirmation dialog 3. Tap Cancel | - | Dialog dismisses, user remains logged in | Medium |
| PROF-F-008 | User Profile | Cancel Edit Profile | User in edit mode | 1. Make changes 2. Tap Cancel | - | Original values restored, no DB write | Medium |

### Negative Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| PROF-N-001 | User Profile | Get Profile Without Auth | No token | 1. GET /api/v1/user/profile without Authorization header | - | 401: "Vui lòng đăng nhập để tiếp tục" | High |
| PROF-N-002 | User Profile | Update Email to Existing | Another account owns the email | 1. Update email to one used by another account | email="someone_else@gmail.com" | Error: "Email này đã được sử dụng bởi tài khoản khác" | High |
| PROF-N-003 | User Profile | Empty Name on Profile Update | Edit mode | 1. Clear name field 2. Save | name="" | Error: "Họ tên không được để trống" | High |
| PROF-N-004 | User Profile | Invalid Email on Profile Update | Edit mode | 1. Enter malformed email 2. Save | email="notanemail" | Error: "Email không hợp lệ" | Medium |
| PROF-N-005 | User Profile | Invalid Phone on Profile Update | Edit mode | 1. Enter invalid phone 2. Save | phone="12345" | Error: "Số điện thoại không hợp lệ" | Medium |
| PROF-N-006 | User Profile | Change Password — Expired Token | Token > 15 min old | 1. Use expired change-password token | - | Error: "Đường dẫn đã hết hạn (hiệu lực 15 phút)" | High |
| PROF-N-007 | User Profile | Delete Account — Wrong Password | User logged in | 1. Provide incorrect current password | password="wrong_pass" | Error: "Mật khẩu hiện tại không chính xác" | High |
| PROF-N-008 | User Profile | Change Password Rate Limit | Request sent < 2 min ago | 1. Send second change-password-link request within 2 min | - | Error: cooldown message with remaining seconds | Medium |
| PROF-N-009 | User Profile | Upload Non-Image Base64 | User logged in | 1. POST /upload with invalid base64 | image="data:text/plain;base64,abc" | Error: "Định dạng hình ảnh không hợp lệ" | Medium |
| PROF-N-010 | User Profile | Upload Without Image Field | User logged in | 1. POST /upload with empty body | image="" | Error: "Vui lòng cung cấp dữ liệu hình ảnh (Base64)" | Medium |

---

## 📋 MODULE 3: Product Catalog

### Functional Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| PROD-F-001 | Product | Get All Products | Products exist in DB | 1. Load Home screen | - | List of active products displayed with name, price, image, category | High |
| PROD-F-002 | Product | Search by Keyword | Products exist | 1. Navigate to Search 2. Type keyword | keyword="chocolate" | Products matching name displayed | High |
| PROD-F-003 | Product | Filter by Category | Categories and products exist | 1. Select a category pill on Home | categoryId=1 | Only products in that category shown | High |
| PROD-F-004 | Product | Filter by Price Range | Products exist | 1. GET /products?minPrice=50000&maxPrice=200000 | minPrice=50000, maxPrice=200000 | Only products in price range returned | Medium |
| PROD-F-005 | Product | Get Product Details | Product exists | 1. Tap any product from list | productId=1 | Product detail screen shows name, price, description, reviews, images | High |
| PROD-F-006 | Product | Get Categories | Categories exist | 1. Load home screen | - | Category grid displayed with correct names and images | Medium |
| PROD-F-007 | Product | Pagination / Infinite Scroll | More than screen-full of products | 1. Scroll to bottom of product list | - | loadMoreProducts triggered, additional products loaded | Medium |
| PROD-F-008 | Product | Sort Products | Products exist | 1. Select sort type (price/newest) | sortType="price" | Products reordered correctly | Low |
| PROD-F-009 | Product | Search with Keyword + Category | Products exist | 1. GET /products?keyword=van&categoryId=2 | keyword="van", categoryId=2 | Products matching both filters returned | Medium |

### Negative Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| PROD-N-001 | Product | Get Non-existent Product | - | 1. GET /products/999999 | productId=999999 | Returns null or 404 | Medium |
| PROD-N-002 | Product | Invalid Product ID | - | 1. GET /products/abc | productId="abc" | Error: "ID sản phẩm không hợp lệ" (400) | Medium |
| PROD-N-003 | Product | Search Empty Keyword | - | 1. GET /products?keyword= | keyword="" | All active products returned | Low |
| PROD-N-004 | Product | Price Filter min > max | - | 1. GET /products?minPrice=500000&maxPrice=10000 | minPrice=500000, maxPrice=10000 | Empty result set (no products match impossible range) | Low |
| PROD-N-005 | Product | Negative Price Filter | - | 1. GET /products?minPrice=-100 | minPrice=-100 | All products with price >= -100 (all products) or validation error | Low |

---

## 📋 MODULE 4: Shopping Cart

### Functional Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| CART-F-001 | Cart | Get Cart | User logged in | 1. Navigate to Cart screen | Auth token valid | Cart contents, item count, total amount displayed | High |
| CART-F-002 | Cart | Add Regular Product to Cart | User logged in, product in stock | 1. Tap + on product 2. Observe cart | product_id=1, quantity=1 | Item added, cart total updated, flying animation plays | High |
| CART-F-003 | Cart | Add Same Product Twice (Merge) | Product already in cart | 1. Add same product again | product_id=1, quantity=1 (existing qty=2) | Quantity updated to 3 (merged, not duplicated) | High |
| CART-F-004 | Cart | Increase Quantity | Item in cart | 1. Tap + button on cart item | cartItemId=5, new_quantity=old+1 | Quantity incremented, total recalculated | High |
| CART-F-005 | Cart | Decrease Quantity to 1 | Item qty=2 in cart | 1. Tap - button | cartItemId=5, new_quantity=1 | Quantity decremented to 1, not removed | High |
| CART-F-006 | Cart | Decrease Quantity to 0 | Item qty=1 in cart | 1. Tap - button | cartItemId=5, quantity=1 | Item removed from cart | High |
| CART-F-007 | Cart | Remove Item | Item in cart | 1. Tap Remove (swipe/X button) | cartItemId=5 | Item removed, cart total updated | High |
| CART-F-008 | Cart | Empty Cart State | Cart is empty | 1. Navigate to Cart screen | - | Empty state UI shown with "Giỏ hàng trống" and Shop Now button | Medium |
| CART-F-009 | Cart | Cart Auto-created | New user, no cart in DB | 1. GET /cart for new user | userId=new_user | Cart created automatically, empty items returned | Medium |

### Negative Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| CART-N-001 | Cart | Add to Cart Without Auth | No token | 1. POST /cart without Authorization | - | 401: "Vui lòng đăng nhập để tiếp tục" | High |
| CART-N-002 | Cart | Add Non-existent Product | - | 1. POST /cart with invalid product_id | product_id=999999 | Error: "Sản phẩm không tồn tại" | High |
| CART-N-003 | Cart | Add Product Exceeding Stock | Product stock=2 | 1. Try to add quantity=5 | product_id=1, quantity=5, stock=2 | Error: "Sản phẩm đã vượt quá số lượng tồn kho (Còn lại: 2)" | High |
| CART-N-004 | Cart | Update Qty Exceeding Stock | Cart item exists, product stock=2 | 1. PATCH /cart/:id with qty=10 | quantity=10, stock=2 | Error: "Sản phẩm đã vượt quá số lượng tồn kho" | High |
| CART-N-005 | Cart | Update Qty to Zero | - | 1. PATCH /cart/:id with qty=0 | quantity=0 | Error: "Số lượng phải lớn hơn 0" | High |
| CART-N-006 | Cart | Update Qty to Negative | - | 1. PATCH /cart/:id with qty=-1 | quantity=-1 | Error: "Số lượng phải lớn hơn 0" | High |
| CART-N-007 | Cart | Remove Item Not in Cart | - | 1. DELETE /cart/99999 | cartItemId=99999 | Error: "Sản phẩm không thuộc giỏ hàng của bạn" | High |
| CART-N-008 | Cart | Add Without product_id or quantity | - | 1. POST /cart with empty body | {} | Error: "Dữ liệu không hợp lệ (cần product_id và quantity)" (400) | Medium |
| CART-N-009 | Cart | Remove Another User's Cart Item | UserA & UserB logged in | 1. UserA tries DELETE /cart/{UserB_item_id} | cartItemId=UserB_item | Error: "Sản phẩm không thuộc giỏ hàng của bạn" | High |

### Boundary Value Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| CART-B-001 | Cart | Add Exactly at Stock Limit | Product stock=5 | 1. Add quantity exactly equal to stock | quantity=5, stock=5 | Succeeds | Medium |
| CART-B-002 | Cart | Merge Reaches Stock Limit | Cart qty=3, stock=5 | 1. Add 2 more of same product | cart_qty=3, add_qty=2, stock=5 | Succeeds (total=5) | Medium |
| CART-B-003 | Cart | Merge Exceeds Stock Limit | Cart qty=4, stock=5 | 1. Add 2 more of same product | cart_qty=4, add_qty=2, stock=5 | Error: "Tổng số lượng vượt quá số lượng tồn kho (Còn lại: 5)" | High |

---

## 📋 MODULE 5: Custom Cake Designer

### Functional Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| DESIGN-F-001 | Custom Design | Get Available Ingredients | Ingredients in DB | 1. Navigate to Design screen 2. Observe ingredient list | - | Ingredients grouped by type (SIZE, BASE, SUGAR, FILLING, FROSTING, TOPPING) ordered by priority | High |
| DESIGN-F-002 | Custom Design | Calculate Custom Price | Ingredients selected | 1. Select ingredients 2. POST /design/calculate-price | ingredientIds=[1,2,3,4] | Total price correctly summed from all ingredient prices | High |
| DESIGN-F-003 | Custom Design | Add Custom Cake to Cart | User logged in, design complete | 1. Design cake 2. Tap Add to Cart | custom_data={size, base, filling, frosting, sugar, toppings[]} | Custom cake added, SHA-256 hash stored for dedup | High |
| DESIGN-F-004 | Custom Design | Duplicate Custom Cake Merges | Same design already in cart | 1. Add identical custom design again | Same ingredientIds | Quantity merged (not duplicated), same hash found | High |
| DESIGN-F-005 | Custom Design | Different Design Not Merged | Different ingredient combo | 1. Add two different designs | ingredientIds=[1,2] then [1,3] | Two separate cart items created | Medium |

### Negative Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| DESIGN-N-001 | Custom Design | Calculate Price — Empty Array | - | 1. POST /design/calculate-price with empty array | ingredientIds=[] | Returns total=0 or handles gracefully | Medium |
| DESIGN-N-002 | Custom Design | Calculate Price — Non-array | - | 1. POST /design/calculate-price with non-array | ingredientIds="abc" | Error: "Danh sách ID nguyên liệu không hợp lệ" (400) | Medium |
| DESIGN-N-003 | Custom Design | Add Custom to Cart Without custom_data | - | 1. POST /cart/custom without custom_data | {quantity:1} | Error: "Dữ liệu không hợp lệ (cần quantity và custom_data)" | Medium |
| DESIGN-N-004 | Custom Design | Checkout with Inactive Ingredient | Ingredient deactivated after adding to cart | 1. Add design with ingredient 2. Deactivate ingredient 3. Checkout | - | Error: "Nguyên liệu X đang tạm hết hàng, không thể đặt" | High |

---

## 📋 MODULE 6: Order Management

### Functional Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| ORD-F-001 | Order | Checkout — COD | User logged in, items in cart | 1. Go to Checkout 2. Enter address & phone 3. Select COD 4. Place Order | address="123 Le Loi, Q1", phone="0912345678", paymentMethod="COD" | Order created (PENDING/UNPAID), cart cleared, stock decremented, order ID returned | High |
| ORD-F-002 | Order | Checkout — BANKING | User logged in, items in cart | 1. Go to Checkout 2. Select BANKING 3. Place Order | paymentMethod="BANKING" | Order created, payment URL returned | High |
| ORD-F-003 | Order | Checkout — MOMO | User logged in, items in cart | 1. Go to Checkout 2. Select MOMO 3. Place Order | paymentMethod="MOMO" | Order created, MOMO payment URL returned | High |
| ORD-F-004 | Order | Checkout — Shipping Fee Applied | Items in cart | 1. Checkout any order | totalAmount=100000 | Final total = subtotal + 30,000 VND shipping | High |
| ORD-F-005 | Order | View Order History | User has orders | 1. Navigate to Orders tab | - | List of all orders with status, date, items | High |
| ORD-F-006 | Order | Filter Order by Status | User has orders in various statuses | 1. Select status filter (PENDING, COMPLETED, etc.) | status="PENDING" | Only PENDING orders shown | Medium |
| ORD-F-007 | Order | View Order Detail | Order exists | 1. Tap any order | orderId=1 | Full details: items, total, address, phone, status, payment status | High |
| ORD-F-008 | Order | Cancel PENDING Order | Order status=PENDING | 1. Tap Cancel on PENDING order 2. Provide reason | orderId=1, reason="Changed mind" | Order set to CANCELLED, stock restored, reason appended to note | High |
| ORD-F-009 | Order | Reorder | Order exists with available products | 1. Tap Reorder on completed order | orderId=1 | Items added to cart (skipping out-of-stock), success message with count | Medium |
| ORD-F-010 | Order | Reorder Skips Inactive Products | Order has discontinued product | 1. Tap Reorder | orderId includes inactive product | Active products added, inactive ones skipped with names listed | Medium |
| ORD-F-011 | Order | Checkout with Note | User logged in | 1. Enter optional note at checkout | note="Please deliver after 6pm" | Note saved in order, returned in detail | Low |

### Negative Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| ORD-N-001 | Order | Checkout Empty Cart | Cart is empty | 1. Navigate to Checkout 2. Tap Place Order | cart=empty | Alert: "Giỏ hàng trống. Vui lòng thêm sản phẩm..." | High |
| ORD-N-002 | Order | Checkout Missing Address | - | 1. Clear address field 2. Tap Place Order | address="" | Client error: "Vui lòng nhập địa chỉ giao hàng" | High |
| ORD-N-003 | Order | Checkout Missing Phone | - | 1. Clear phone field 2. Tap Place Order | phone="" | Client error: "Vui lòng nhập số điện thoại" | High |
| ORD-N-004 | Order | Checkout Invalid Phone | - | 1. Enter invalid phone | phone="12345" | Client error: "Số điện thoại không hợp lệ" | High |
| ORD-N-005 | Order | Checkout Insufficient Stock | Product stock=1, cart qty=2 | 1. Checkout | - | Error: "Sản phẩm X không đủ số lượng tồn kho (Còn lại: 1)" | High |
| ORD-N-006 | Order | Checkout Discontinued Product | Product deactivated mid-session | 1. Checkout with discontinued product | - | Error: "Sản phẩm X đã ngừng kinh doanh" | High |
| ORD-N-007 | Order | Cancel Non-PENDING Order | Order status=CONFIRMED | 1. Try to cancel confirmed order | orderId with CONFIRMED status | Error: "Chỉ có thể hủy đơn hàng khi đang ở trạng thái chờ xác nhận" | High |
| ORD-N-008 | Order | Access Another User's Order | UserB order | 1. GET /orders/{UserB_orderId} as UserA | orderId=UserB's | Error: "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập" | High |
| ORD-N-009 | Order | Cancel Another User's Order | UserB order | 1. POST /orders/{UserB_orderId}/cancel as UserA | orderId=UserB's | Error: "Đơn hàng không tồn tại" | High |
| ORD-N-010 | Order | Checkout Without Auth | No token | 1. POST /orders/checkout without Authorization | - | 401: "Vui lòng đăng nhập để tiếp tục" | High |
| ORD-N-011 | Order | Invalid Order ID | - | 1. GET /orders/abc | orderId="abc" | Error: "ID đơn hàng không hợp lệ" (400) | Medium |

### Boundary Value Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| ORD-B-001 | Order | Checkout Race Condition | Two users adding same last-stock item simultaneously | 1. Both checkout at same time | product stock=1 | Only one succeeds; second gets "vừa bị người khác mua hết" error; DB transaction ensures atomicity | High |
| ORD-B-002 | Order | Checkout Stock = Quantity | Product stock=3, cart qty=3 | 1. Checkout | - | Succeeds, stock becomes 0 | High |
| ORD-B-003 | Order | Voucher Discount = 0% | No voucher applied | 1. Checkout without voucher | discountPercent=0 | finalAmount = totalAmount (no change) | Medium |
| ORD-B-004 | Order | Voucher Discount = 100% | 100% voucher applied (UI only) | 1. Apply 100% discount | discountPercent=100 | finalAmount = 0, note: no server-side voucher validation exists | Medium |

---

## 📋 MODULE 7: Review System

### Functional Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| REV-F-001 | Review | Create Review (COMPLETED order) | Order is COMPLETED, user is buyer | 1. Navigate to Review screen 2. Select rating 3. Enter comment 4. Submit | orderId=1 (COMPLETED), productId=1, rating=5, comment="Great!" | Review created for all products in the order, success modal shown | High |
| REV-F-002 | Review | Create Review with Image | COMPLETED order | 1. Upload image 2. Submit review | image=base64_image_url | Review saved with image URL | Medium |
| REV-F-003 | Review | Update Review | Review exists, user owns it | 1. Edit review 2. Change rating/comment 3. Submit | reviewId=1, rating=4, comment="Updated" | Review updated in DB | Medium |
| REV-F-004 | Review | Delete Review | Review exists, user owns it | 1. DELETE /reviews/:id | reviewId=1 | Review deleted from DB | Medium |
| REV-F-005 | Review | Check Review Status | Order reviewed | 1. GET /reviews/check/:productId?orderId=X | productId=1, orderId=1 | Returns {hasReviewed: true} | Medium |
| REV-F-006 | Review | Check Review Status (Not Reviewed) | Order not reviewed | 1. GET /reviews/check/:productId?orderId=X | productId=1, orderId=2 | Returns {hasReviewed: false} | Medium |
| REV-F-007 | Review | Rating Labels Display | On review screen | 1. Tap each star rating 1-5 | rating=1..5 | Labels: "Rất không hài lòng"..."Rất hài lòng" shown correctly | Low |

### Negative Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| REV-N-001 | Review | Review Without Completing Order | Order status = PENDING/SHIPPING | 1. Try to create review | orderId (not COMPLETED) | Error: "Bạn cần mua và nhận hàng thành công để đánh giá" | High |
| REV-N-002 | Review | Duplicate Review | Order already reviewed | 1. Submit review again | same orderId | Error: "Bạn đã đánh giá đơn hàng này rồi" | High |
| REV-N-003 | Review | Review Missing Rating | - | 1. Submit without selecting rating | rating=undefined/null | Error: "Vui lòng chọn số sao hợp lệ từ 1 đến 5" | High |
| REV-N-004 | Review | Rating = 0 | - | 1. Submit rating=0 | rating=0 | Error: "Vui lòng chọn số sao hợp lệ từ 1 đến 5" | High |
| REV-N-005 | Review | Rating = 6 | - | 1. POST /reviews/:id with rating=6 | rating=6 | Error: "Vui lòng chọn số sao hợp lệ từ 1 đến 5" | High |
| REV-N-006 | Review | Edit Another User's Review | Review belongs to UserB | 1. PATCH /reviews/{reviewId} as UserA | reviewId=UserB's | Error: "Bạn không có quyền sửa đánh giá này" | High |
| REV-N-007 | Review | Delete Another User's Review | Review belongs to UserB | 1. DELETE /reviews/{reviewId} as UserA | reviewId=UserB's | Error: "Bạn không có quyền xóa đánh giá này" | High |
| REV-N-008 | Review | Review Non-existent Order | - | 1. Submit review with fake orderId | orderId=999999 | Error: "Bạn cần mua và nhận hàng thành công để đánh giá" | Medium |
| REV-N-009 | Review | Review Without productId | - | 1. POST /reviews/null | productId=0 | Error: "Dữ liệu không hợp lệ (cần productId và orderId)" | Medium |

### Boundary Value Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| REV-B-001 | Review | Rating = 1 (minimum valid) | - | 1. Submit rating=1 | rating=1 | Accepted | Medium |
| REV-B-002 | Review | Rating = 5 (maximum valid) | - | 1. Submit rating=5 | rating=5 | Accepted | Medium |
| REV-B-003 | Review | Long Comment | - | 1. Enter very long comment (1000+ chars) | comment=1000_char_string | Saved (no maxlength enforced server-side) | Low |
| REV-B-004 | Review | Empty Comment | - | 1. Submit review with no comment | comment="" | Review created with null comment (optional) | Low |

---

## 📋 MODULE 8: Payment

### Functional Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| PAY-F-001 | Payment | Process Payment — MOMO | Order exists, UNPAID | 1. POST /payment/:orderId/process | orderId=1, method="MOMO" | Mock payment URL returned with amount and txnRef | High |
| PAY-F-002 | Payment | Process Payment — BANKING | Order exists, UNPAID | 1. POST /payment/:orderId/process | orderId=1, method="BANKING" | Mock payment URL returned | High |
| PAY-F-003 | Payment | Verify Payment — Success | Payment gateway callback | 1. GET /payment/:orderId/verify?resultCode=0 | orderId=1, resultCode="0" | Order status → CONFIRMED, payment_status → PAID | High |
| PAY-F-004 | Payment | Verify Payment — VNPay Success | VNPay callback | 1. GET /payment/:orderId/verify?vnp_ResponseCode=00 | vnp_ResponseCode="00" | Order confirmed and paid | High |
| PAY-F-005 | Payment | Verify Payment — Failure | User cancels payment | 1. GET /payment/:orderId/verify?resultCode=99 | resultCode="99" | Order stays PENDING/UNPAID | High |
| PAY-F-006 | Payment | Handle Webhook — Success | Payment gateway S2S callback | 1. POST /payment/webhook with success data | resultCode=0, orderId="DH1_timestamp" | Order confirmed & paid silently; HTTP 200 returned | High |
| PAY-F-007 | Payment | Handle Webhook — Order Not Found | Webhook with bad ID | 1. POST /payment/webhook | orderId="DH999999_ts" | Returns {status:"error", message:"Order not found"} | Medium |

### Negative Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| PAY-N-001 | Payment | Process Payment — Already Paid | Order payment_status=PAID | 1. POST /payment/:orderId/process | - | Error: "Đơn hàng này đã được thanh toán" | High |
| PAY-N-002 | Payment | Process Payment — Non-existent Order | - | 1. POST /payment/999999/process | orderId=999999 | Error: "Đơn hàng không tồn tại" | Medium |
| PAY-N-003 | Payment | Process Payment — Missing Method | - | 1. POST /payment/:orderId/process without method | method=undefined | Error: "Dữ liệu thanh toán không hợp lệ" (400) | Medium |
| PAY-N-004 | Payment | Process Payment Without Auth | No token | 1. POST /payment/:orderId/process | - | 401 Unauthorized | High |
| PAY-N-005 | Payment | Verify Payment — Invalid Order ID | - | 1. GET /payment/0/verify | orderId=0 | Error: "ID đơn hàng không hợp lệ" | Medium |

---

## 📋 MODULE 9: Admin Panel

### Functional Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| ADMIN-F-001 | Admin | Admin Login | Admin credentials exist | 1. Open admin panel 2. Enter credentials 3. Login | (admin credentials) | Dashboard loaded, order list displayed | High |
| ADMIN-F-002 | Admin | View All Orders | Orders exist | 1. Login to admin 2. View dashboard | - | Orders listed with customer name, status, products, total | High |
| ADMIN-F-003 | Admin | Update Order Status — Confirm | Order is PENDING | 1. Select order 2. Change status to CONFIRMED | orderId=1, status="confirmed" | DB updated to CONFIRMED, UI reflects change | High |
| ADMIN-F-004 | Admin | Update Order Status — Processing | Order is CONFIRMED | 1. Change status to PROCESSING | status="processing" | Order status updated | High |
| ADMIN-F-005 | Admin | Update Order Status — Shipping | - | 1. Change status to SHIPPING | status="shipping" | Order status updated | High |
| ADMIN-F-006 | Admin | Update Order Status — Completed | - | 1. Change status to COMPLETED | status="completed" | Order marked complete, review becomes available | High |
| ADMIN-F-007 | Admin | Reject Order | Order is PENDING | 1. Change status to REJECTED | status="rejected" | Order status → CANCELLED in DB | Medium |
| ADMIN-F-008 | Admin | Orders Sorted — PENDING First | Mixed status orders | 1. Load admin order list | - | PENDING orders appear at top (ORDER BY pending DESC) | Medium |

### Negative Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| ADMIN-N-001 | Admin | Update Order — Invalid Status | - | 1. PATCH /admin/orders/:id with unknown status | status="flying" | Error: "Trạng thái đơn hàng không hợp lệ" (400) | Medium |
| ADMIN-N-002 | Admin | Update Order — Non-existent | - | 1. PATCH /admin/orders/999999 | orderId=999999 | Error: "Không tìm thấy đơn hàng để cập nhật" (404) | Medium |
| ADMIN-N-003 | Admin | Admin Route Without Auth | No token | 1. Access /admin/orders without auth | - | 401 Unauthorized | High |

---

## 📋 MODULE 10: Integration Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| INT-001 | Integration | Full Purchase Flow — COD | User registered & logged in, products in stock | 1. Browse products 2. Add to cart 3. Checkout COD 4. View in order history | product_id=1, qty=2, COD | Order appears in history as PENDING, stock decremented by 2, cart cleared | High |
| INT-002 | Integration | Full Purchase Flow — Online Payment | User registered, items in cart | 1. Checkout with MOMO 2. Verify payment callback 3. Check order status | paymentMethod="MOMO", resultCode=0 | Order moves to CONFIRMED + PAID after webhook | High |
| INT-003 | Integration | Cancel Order → Stock Restored | PENDING order with product | 1. Checkout product qty=2 2. Cancel order | orderId=1 | Stock of product restored by 2 | High |
| INT-004 | Integration | Complete Order → Review Available | COMPLETED order | 1. Admin marks order COMPLETED 2. User navigates to review | orderId=COMPLETED | Review screen accessible, blockerMsg absent | High |
| INT-005 | Integration | Reorder → Cart Population | User has completed order | 1. Tap Reorder 2. Navigate to Cart | orderId=1 | All available items from original order appear in cart | Medium |
| INT-006 | Integration | Avatar Upload → Profile Update | User logged in | 1. Pick image 2. Upload 3. Profile avatar updates | JPEG image | Upload API returns URL, updateProfile called with avatar_url, avatar shown | Medium |
| INT-007 | Integration | Forgot Password → Reset → Login | User exists | 1. Request reset 2. Click email link 3. Reset password 4. Login with new password | newPassword="NewSafe@123" | All steps complete, old password invalid, new password works | High |
| INT-008 | Integration | Register → Auto Login → Browse | New user | 1. Register 2. Observe automatic login 3. Browse home | - | Seamless flow: register → home screen with products | High |
| INT-009 | Integration | DB Transaction — Checkout Failure | Insufficient stock halfway | 1. Cart has 2 products; second has insufficient stock | product2 stock=0 | Transaction rolled back; no order created, no stock decremented for product1 | High |
| INT-010 | Integration | Checkout Custom Cake | Design cake, add to cart, checkout | 1. Design → Add to cart → Checkout | custom ingredients | Price re-calculated server-side from live ingredient prices, not client-submitted price | High |

---

## 📋 MODULE 11: Security Testing

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| SEC-001 | Security | JWT Token Validation | - | 1. Access protected route with tampered token | token="eyJhbGci...TAMPERED" | 401: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" | Critical |
| SEC-002 | Security | JWT Expired Token | Token > 7 days old | 1. Access /user/profile with expired JWT | expired_token | 401: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" | Critical |
| SEC-003 | Security | IDOR — Access Other User's Order | UserA's order | 1. UserB GET /orders/{UserA_orderId} | orderId=UserA's | 403 or "Đơn hàng không tồn tại" (user_id check enforced) | Critical |
| SEC-004 | Security | IDOR — Modify Other User's Cart | UserA's cart item | 1. UserB PATCH /cart/{UserA_item_id} | - | Error: "Sản phẩm không có trong giỏ hàng" | Critical |
| SEC-005 | Security | IDOR — Delete Other User's Review | UserA's review | 1. UserB DELETE /reviews/{UserA_reviewId} | - | Error: "Bạn không có quyền xóa đánh giá này" | Critical |
| SEC-006 | Security | Hardcoded JWT Secret | Server misconfigured | 1. Check if JWT_SECRET is "secret" in production | JWT_SECRET fallback | Critical: "secret" used if env var missing; tokens easily forgeable | Critical |
| SEC-007 | Security | SQL Injection via Search | - | 1. GET /products?keyword='; DROP TABLE Products;-- | keyword="'; DROP TABLE..." | Parameterized query prevents injection; no DB error | Critical |
| SEC-008 | Security | XSS via Product Search | - | 1. Search with `<script>alert(1)</script>` | keyword="<script>alert(1)</script>" | Sanitized or escaped in response; not executed | High |
| SEC-009 | Security | Password Exposed in Profile | - | 1. GET /user/profile | Auth token valid | Response does NOT include password field | Critical |
| SEC-010 | Security | Reset Token in Plaintext URL | Email link inspection | 1. Inspect reset link URL | resetLink=http://...?token=HEX | Token exposed in URL — no HTTPS enforced (hardcoded HTTP) | High |
| SEC-011 | Security | Webhook Missing Signature Validation | - | 1. POST /payment/webhook from unknown source | Any body | HMAC check is commented out in code — any caller accepted | Critical |
| SEC-012 | Security | Mass Assignment on Profile Update | - | 1. PATCH /user/profile with is_verified=0, is_active=0 | is_verified: 0 | Extra fields ignored (only name, email, phone, address, avatar_url processed) | High |
| SEC-013 | Security | Brute Force Login | - | 1. Repeatedly POST /auth/login with wrong passwords | 100 attempts | No rate limiting detected on login endpoint — potential brute force attack | High |
| SEC-014 | Security | Reset Password Token Enumeration | - | 1. Try sequential/predictable tokens | token="aaa...000" | crypto.randomBytes(32) makes enumeration infeasible | Medium |
| SEC-015 | Security | File Upload — Unrestricted Type | - | 1. Upload non-image file as Base64 | data:application/pdf;base64,... | Extension taken from MIME type; PDF could be saved as .pdf on server | High |
| SEC-016 | Security | Delete Account — Verifies Password | - | 1. Request delete without password | password="" | Error: "Vui lòng nhập mật khẩu xác nhận" (400) enforced | High |
| SEC-017 | Security | Hardcoded IP in Production | Source code | 1. Inspect backend URLs | IP="192.124.15.101" hardcoded in 4 places | Security/ops risk: hardcoded private IP exposed in redirect links | Medium |

---

## 📋 MODULE 12: UI / UX Testing (Mobile)

| Test Case ID | Module | Feature | Precondition | Steps | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|---|
| UI-001 | UI | Login Screen Layout | App open | 1. Navigate to login | - | Gradient background, card with border, animated entry (ZoomIn) displayed | Medium |
| UI-002 | UI | Keyboard Avoidance | Login screen | 1. Tap email/password input 2. Keyboard appears | - | Content scrolls up, inputs remain visible (KeyboardAvoidingView) | High |
| UI-003 | UI | Password Toggle Visibility | Login screen | 1. Tap eye icon on password field | - | Password shown/hidden correctly | Medium |
| UI-004 | UI | Error Field Highlighting | Login — wrong credentials | 1. Submit invalid credentials | - | Error field border changes color, error message shown below input | High |
| UI-005 | UI | Loading State During Submit | Login screen | 1. Tap Login while request in flight | - | Button shows ActivityIndicator, cannot double-submit | High |
| UI-006 | UI | Cart Item Count Badge | Items in cart | 1. View home screen | - | Floating cart button shows correct item count | Medium |
| UI-007 | UI | Flying Dot Animation | Add item to cart | 1. Tap + on product card | - | Dot flies from product to cart button with animation | Low |
| UI-008 | UI | Forgot Password Success State | After submitting email | 1. Submit valid email for password reset | - | Success UI shows mail icon, entered email displayed, 15-min note visible | Medium |
| UI-009 | UI | Empty Order History | No orders | 1. Navigate to Orders tab | - | Empty state message displayed | Low |
| UI-010 | UI | Order Status Colors/Labels | Orders with various statuses | 1. View order list | - | Each status rendered with appropriate label and color | Low |
| UI-011 | UI | Review Success Modal | After submitting review | 1. Submit review | - | Overlay modal with green check and "Cảm ơn bạn đã đánh giá!" shown, auto-dismiss | Medium |
| UI-012 | UI | Banner Carousel | Home screen | 1. Load home screen | - | Banner images cycle automatically | Low |
| UI-013 | UI | Category Selection | Home screen | 1. Tap category 2. Tap again | - | Category highlighted on select, filter applied; deselect resets filter | Medium |
| UI-014 | UI | Android Status Bar Padding | Android device | 1. Open Cart screen | - | Header padding accounts for Android StatusBar height | Medium |
| UI-015 | UI | Checkout Address Pre-fill | User has saved address | 1. Navigate to Checkout | user.address exists | Address input pre-filled from user profile | Medium |

---

## 🔍 GAP ANALYSIS

### ⚠️ Untested Code Paths

| # | Location | Untested Path | Risk |
|---|---|---|---|
| 1 | `auth.service.ts:34` | `verifyRegister()` function exists but always returns success without checking OTP — backwards compatibility stub that could be abused | High |
| 2 | `payment.service.ts:56-63` | HMAC webhook signature check is **commented out** — webhook accepts any caller without verification | Critical |
| 3 | `order.service.ts:110` | `skippedItems` message concatenation logic — edge case when ALL items are skipped (empty cart after reorder) | Medium |
| 4 | `cart.service.ts:39-55` | `custom_data` parsing when `totalPrice` or `cakeName` keys are missing — undefined fallback | Medium |
| 5 | `adminOrder.controller.ts:23` | `normalizeStatus()` default returns `value?.toLowerCase() || 'unknown'` — unknown statuses silently stored | Low |
| 6 | `auth.controller.ts:94-133` | `resetPasswordRedirect` injects `token` query param directly into HTML without sanitization — potential XSS via token manipulation | High |
| 7 | `user.controller.ts:85-118` | `changePasswordRedirect` same unsanitized token injection into HTML | High |
| 8 | `user.service.ts:143-148` | Delete account silently ignores errors for CartItems, Reviews, OrderItems — `try/catch(e){}` swallows errors | Medium |
| 9 | `order.service.ts:207` | Shipping fee hardcoded at 30,000 VND — no logic for free shipping, distance-based fee, or weight | Medium |
| 10 | `productModel.ts:96` | `update()` builds SQL SET clause dynamically from any keys passed — no whitelist of allowed columns | High |

### 🚫 Missing Validations

| # | Location | Missing Validation | Impact |
|---|---|---|---|
| 1 | `authController.register` | No email format validation server-side (only client-side regex) | Medium |
| 2 | `authController.register` | No password strength/length validation on server or client | High |
| 3 | `authController.login` | No rate limiting on failed login attempts — brute force vulnerable | High |
| 4 | `reviewController.createReview` | `rating` field not validated at controller level — only in service | Low |
| 5 | `cartController.addToCart` | `quantity` can be 0 or negative when adding new item — only checked on update | High |
| 6 | `orderController.checkoutOrder` | No validation that `paymentMethod` is one of COD/BANKING/MOMO at controller level | Medium |
| 7 | `uploadRoutes.ts` | No file size limit on Base64 uploads — large payloads could DoS the server | High |
| 8 | `uploadRoutes.ts` | Extension derived from MIME type without whitelist — any MIME accepted | High |
| 9 | `userModel.updateProfile` | No whitelist of allowed fields — any column name could be injected if inputs aren't sanitized upstream | High |
| 10 | `useCheckoutForm.ts` (frontend) | Voucher discount is only applied client-side (`discountPercent`) — no server-side voucher validation | Critical |
| 11 | `useRegisterForm.ts` | Email format not validated client-side before submission (only checked if empty) | Medium |
| 12 | `adminOrder.controller.ts` | No authentication middleware on admin routes — admin API fully unprotected | Critical |

### 🐛 Potential Bugs

| # | Location | Bug Description | Severity |
|---|---|---|---|
| 1 | `authController.ts:98` | `resetPasswordRedirect` uses hardcoded `exp://192.124.15.101:8081` — won't work outside dev network | High |
| 2 | `userController.ts:88` | `changePasswordRedirect` and `deleteAccountRedirect` have same hardcoded Expo IP | High |
| 3 | `authService.ts:96` | Reset link uses `http://192.124.15.101:3000` — hardcoded private IP, not environment-configurable | High |
| 4 | `auth.middleware.ts:6` | `JWT_SECRET` defaults to `'secret'` if env var missing — tokens forgeable in any misconfigured environment | Critical |
| 5 | `reviewService.ts:29` | Review created for ALL products in order (not just the one in `productId` param) — `productId` param ignored in creation loop | Medium |
| 6 | `userService.ts:143` | `DELETE FROM CartItems WHERE user_id = ?` — `CartItems` table likely has `cart_id`, not `user_id` FK — delete silently fails | High |
| 7 | `order.service.ts:205` | `discount` is hardcoded to 0 — client-side voucher discount not sent to server; checkout total ignores discount | Critical |
| 8 | `cartService.ts:108-110` | JSON.parse on `custom_data` inside a find() loop without error handling — malformed JSON crashes request | Medium |
| 9 | `paymentService.ts:36` | `callbackData.resultCode === '0'` (string) vs `webhookData.resultCode === 0` (number) — inconsistent type check may miss valid callbacks | High |
| 10 | `adminOrder.controller.ts:41-45` | Raw SQL query without parameterization using `pool.query()` with template literal — minor injection risk if status filter added | Medium |
| 11 | `useCheckoutForm.ts:26` | `finalAmount` calculated client-side; `handlePlaceOrder` calls `createOrder()` which uses server-side total ignoring `discountPercent` | Critical |
| 12 | `auth.routes.ts:12` | Logout endpoint does nothing server-side (no token blacklist) — JWT remains valid after logout | High |

### 🔐 Security Risks Summary

| # | Risk | Severity | CVSS Category |
|---|---|---|---|
| 1 | Webhook signature validation commented out | Critical | Authentication Bypass |
| 2 | JWT default secret = "secret" | Critical | Broken Authentication |
| 3 | Admin panel has NO authentication middleware | Critical | Broken Access Control |
| 4 | No brute force protection on login | High | Authentication |
| 5 | Reset token injected unsanitized into HTML | High | XSS |
| 6 | Voucher discount applied only client-side | Critical | Business Logic |
| 7 | Hardcoded private IP in source code | Medium | Information Disclosure |
| 8 | No file type whitelist on upload | High | Unrestricted Upload |
| 9 | No file size limit on upload | High | DoS / Resource Exhaustion |
| 10 | Dynamic SQL field names in updateProfile | High | SQL Injection |
| 11 | No rate limiting on login | High | Brute Force |
| 12 | Delete account ignores silent errors | Medium | Data Integrity |

---

## 📊 Test Coverage Estimate

| Module | Test Cases | Estimated Code Coverage | Notes |
|---|---|---|---|
| Authentication | 30 | ~85% | Missing: email format server-side, password policy |
| User Profile | 20 | ~80% | Missing: OTP verification flow depth |
| Product Catalog | 15 | ~75% | Missing: inactive product edge cases |
| Shopping Cart | 25 | ~85% | Missing: concurrent add scenarios |
| Custom Design | 10 | ~70% | Missing: empty ingredient combo |
| Orders | 30 | ~85% | Missing: partial stock scenarios |
| Reviews | 20 | ~90% | Good coverage |
| Payment | 15 | ~70% | Webhook HMAC untested (commented out) |
| Admin | 15 | ~60% | No auth on admin routes — critical gap |
| Integration | 10 | ~75% | E2E flows covered |
| Security | 20 | ~70% | Many risks found in static analysis |
| UI/UX | 15 | ~65% | Device-specific tests needed |
| **TOTAL** | **225** | **~78%** | **Target: ≥ 90% for production readiness** |

---

## 📁 Excel Import Instructions

To import this into Excel/Google Sheets:
1. Copy any table above
2. Paste into Excel → **Data → Text to Columns → Delimited → Pipe (|)**
3. Or use Google Sheets → **File → Import → Paste** (auto-detects Markdown tables)

Alternatively, use a tool like **Markdown Table to CSV converter** before importing.

---

*Generated by Senior QA Engineer AI — DADNT Cupcake App v1.0*
