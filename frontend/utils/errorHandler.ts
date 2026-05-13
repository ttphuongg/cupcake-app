import axios, { AxiosError } from 'axios';

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Nếu có phản hồi từ Server (Server có nhận request nhưng xử lý thất bại)
    if (axiosError.response) {
      // Ưu tiên lấy message do chính backend mình viết
      const serverMessage = axiosError.response.data?.message;
      if (serverMessage) return serverMessage;

      // Nếu không có message, fallback hiển thị theo Status Code
      switch (axiosError.response.status) {
        case 400: return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
        case 401: return 'Phiên đăng nhập hết hạn hoặc sai mật khẩu. Vui lòng đăng nhập lại.';
        case 403: return 'Bạn không có quyền thực hiện hành động này.';
        case 404: return 'Không tìm thấy dữ liệu.';
        case 500: return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
        default: return `Đã xảy ra lỗi hệ thống (Mã lỗi: ${axiosError.response.status}).`;
      }
    }

    // Lỗi do không thể kết nối đến Server (Chưa nhận được phản hồi)
    if (axiosError.request) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng của bạn.';
    }
  }

  // Lỗi JS thuần túy phát sinh ở Frontend (ví dụ parse JSON lỗi)
  if (error instanceof Error) {
    return error.message;
  }

  return 'Đã xảy ra một lỗi không xác định.';
};
