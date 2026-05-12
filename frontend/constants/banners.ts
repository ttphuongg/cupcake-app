import { Banner } from '../components/BannerCarousel';

/**
 * Dữ liệu banner tĩnh cho màn hình trang chủ.
 * Thay đổi nội dung marketing tại đây mà không cần chỉnh sửa component.
 */
export const BANNERS: Banner[] = [
  {
    id: 'banner-design',
    title: 'Thiết kế bánh của bạn',
    subtitle: 'Tùy chỉnh từng lớp nguyên liệu theo sở thích riêng',
    link: '/design',
    colors: ['#F8BBD9', '#E8A0BF', '#BA90C6'],
  },
  {
    id: 'banner-sale',
    title: 'Ưu đãi cuối tuần 🎉',
    subtitle: 'Giảm 20% cho đơn hàng từ 200.000đ — chỉ T7 & CN',
    link: '/(tabs)',
    colors: ['#FFDDE1', '#FFB3C1', '#FF8FA3'],
  },
  {
    id: 'banner-new',
    title: 'Bộ sưu tập Matcha mới',
    subtitle: 'Hương vị thanh mát, tinh tế — thử ngay hôm nay',
    link: '/(tabs)',
    colors: ['#C8E6C9', '#A5D6A7', '#81C784'],
  },
];
