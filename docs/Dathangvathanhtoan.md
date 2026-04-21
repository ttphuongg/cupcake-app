# [cite_start]TÀI LIỆU HỆ THỐNG QUẢN LÝ ĐẶT HÀNG [cite: 1]

## [cite_start]1. Biểu đồ USECASE và bảng đặc tả [cite: 1]

[cite_start]Dưới đây là biểu đồ Use Case mô tả các chức năng của hệ thống và tương tác với Khách hàng[cite: 1]:

```mermaid
useCaseDiagram
    actor "Khách hàng" as Customer
    
    package "Hệ thống quản lý đặt hàng" {
        usecase "Xem giỏ hàng" as UC_Cart
        usecase "Cập nhật giỏ hàng" as UC_UpdateCart
        usecase "Đặt hàng" as UC_Order
        usecase "Xác nhận thông tin giao hàng" as UC_ConfirmInfo
        usecase "Chọn phương thức thanh toán" as UC_Payment
        usecase "Sử dụng mã giảm giá" as UC_Voucher
        usecase "Ghi chú cho cửa hàng và shipper" as UC_Note
        usecase "Theo dõi đơn hàng" as UC_Track
        usecase "Xem chi tiết sản phẩm" as UC_Detail
        usecase "Thêm vào giỏ hàng" as UC_AddToCart
    }

    Customer --> UC_Cart [cite: 1]
    Customer --> UC_Order [cite: 1]
    Customer --> UC_Track [cite: 1]
    Customer --> UC_Detail [cite: 1]

    UC_UpdateCart ..> UC_Cart : <<Extend>> [cite: 1]
    UC_Order ..> UC_ConfirmInfo : <<Include>> [cite: 1]
    UC_Order ..> UC_Payment : <<Include>> [cite: 1]
    UC_Voucher ..> UC_Order : <<Extend>> [cite: 1]
    UC_Note ..> UC_Order : <<Extend>> [cite: 1]
    UC_AddToCart ..> UC_Detail : <<Extend>> [cite: 1]
