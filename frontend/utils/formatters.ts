/**
 * Định dạng số thành tiền tệ VNĐ
 * Ví dụ: 150000 -> "150.000 ₫"
 */
const viFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount: number | string | undefined | null): string => {
  // Thêm khoảng trắng " đ" để giao diện thoáng hơn, nếu thích viết liền bạn có thể giữ nguyên "đ"
  if (amount === undefined || amount === null) return '0 đ';

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0 đ';

  return viFormatter.format(num) + ' đ';
};


/**
 * Định dạng ngày giờ
 * Ví dụ: 2026-05-06T14:45:24+07:00 -> "06/05/2026 14:45"
 */
export const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
