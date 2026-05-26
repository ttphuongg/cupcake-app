// =====================================================================
// CategoryGrid.tsx — Component hiển thị lưới danh mục sản phẩm
// Chức năng: Hiển thị các danh mục dưới dạng lưới 4 cột x 2 hàng,
// có thể vuốt ngang để xem thêm trang. Khi nhấn vào 1 danh mục,
// component cha (HomeScreen) sẽ lọc sản phẩm theo danh mục đó.
// =====================================================================

// --- IMPORT THƯ VIỆN ---
// useState: quản lý state (pageIndex — trang đang xem)
// useRef: tạo tham chiếu đến Animated.Value, giữ giá trị không bị tạo lại mỗi lần re-render
// useEffect: chạy side-effect (animation fade-in) khi component mount lần đầu
import React, { useState, useRef, useEffect } from 'react';

// --- IMPORT COMPONENT & API TỪ REACT NATIVE ---
// View: container bọc các phần tử (tương tự <div> trên web)
// Text: hiển thị chữ (tên danh mục)
// StyleSheet: tạo object styles tối ưu cho React Native
// ScrollView: vùng cuộn ngang chứa các trang danh mục
// TouchableOpacity: nút bấm có hiệu ứng mờ khi nhấn
// Dimensions: API lấy kích thước màn hình (width, height)
// Animated: API animation của React Native
// NativeSyntheticEvent, NativeScrollEvent: kiểu TypeScript cho sự kiện cuộn
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

// --- IMPORT ICON TỪ THƯ VIỆN LUCIDE ---
// Mỗi icon sẽ được gán cho một loại danh mục dựa trên tên danh mục
// Ví dụ: "Chocolate" → Cookie, "Matcha" → Leaf, "Bestseller" → Trophy
import {
  Cake,           // Icon bánh — dùng cho "Tất cả" và mặc định
  Trophy,         // Icon cúp — dùng cho "Bestseller"
  Sparkles,       // Icon lấp lánh — dùng cho "Mới"
  Ticket,         // Icon vé — dùng cho "Mã giảm giá" / "Khuyến mãi"
  Cookie,         // Icon cookie — dùng cho "Chocolate"
  Apple,          // Icon táo — dùng cho "Trái cây" / "Fruit"
  Leaf,           // Icon lá — dùng cho "Matcha"
  Crown,          // Icon vương miện — dùng cho "Cao cấp" / "Premium"
  MoreHorizontal  // Icon "..." — chưa sử dụng, dự phòng cho nút "Xem thêm"
} from 'lucide-react-native';

// --- IMPORT KIỂU DỮ LIỆU & BẢNG MÀU ---
// Category: kiểu dữ liệu danh mục (có id và name)
// Colors: bảng màu chung cho toàn ứng dụng (primary, background, foreground...)
import { Category } from '../types';
import { Colors } from '../constants/theme';

// --- LẤY CHIỀU RỘNG MÀN HÌNH ---
// Dùng để: (1) mỗi trang danh mục rộng đúng bằng màn hình khi vuốt ngang
//           (2) tính toán trang hiện tại trong hàm onScrollEnd
// Ví dụ: iPhone 14 → width = 390, Samsung S24 → width = 412
const { width } = Dimensions.get('window');

// =====================================================================
// INTERFACE — Định nghĩa kiểu dữ liệu cho props mà component nhận vào
// =====================================================================
// Props này được truyền từ component cha (HomeScreen trong index.tsx)
// Luồng: HomeScreen truyền data + selectedCategory + onCategorySelect xuống
//         → CategoryGrid hiển thị lưới → người dùng nhấn → gọi onCategorySelect
//         → HomeScreen cập nhật state → lọc sản phẩm theo danh mục
interface CategoryGridProps {
  // Danh sách danh mục lấy từ API
  // Ví dụ: [{id: 1, name: "Chocolate"}, {id: 2, name: "Matcha"}, ...]
  data: Category[];

  /** null = "Tất cả" (không lọc). Dùng number để match với category.id từ API */
  // Ví dụ: null → hiển thị tất cả sản phẩm, 1 → chỉ hiện sản phẩm Chocolate
  selectedCategory: number | null;

  // Hàm callback — gọi khi người dùng nhấn chọn 1 danh mục
  // Truyền id danh mục (number) hoặc null (nếu chọn "Tất cả")
  onCategorySelect: (categoryId: number | null) => void;
}

// =====================================================================
// COMPONENT CHÍNH — CategoryGrid
// =====================================================================
export const CategoryGrid = ({
  data,
  onCategorySelect,
  selectedCategory,
}: CategoryGridProps) => {

  // --- STATE ---

  // pageIndex: theo dõi trang hiện tại đang hiển thị (0, 1, 2...)
  // Dùng để: xác định dấu chấm pagination nào được highlight (activeDot)
  // Cập nhật khi: người dùng vuốt xong (trong hàm onScrollEnd)
  const [pageIndex, setPageIndex] = useState(0);

  // fadeAnim: giá trị animation điều khiển opacity (độ trong suốt)
  // Giá trị ban đầu = 0 (ẩn hoàn toàn), sau animation = 1 (hiện hoàn toàn)
  // Dùng useRef thay vì useState vì:
  //   - Animated.Value là object mutable, không cần trigger re-render khi giá trị thay đổi
  //   - Animation chạy ở native thread, không cần React biết
  // .current lấy giá trị thực từ ref object
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- HIỆU ỨNG FADE-IN ---
  // Khi component render lần đầu, chạy animation trong 300ms để các item danh mục
  // xuất hiện mượt mà thay vì hiện đột ngột.
  // Animated.timing: animation chạy tuyến tính từ giá trị hiện tại → toValue
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,              // Giá trị đích: opacity = 1 (hiện hoàn toàn)
      duration: 300,           // Thời gian chạy: 300ms (0.3 giây)
      useNativeDriver: true,   // Chạy trên native thread (iOS/Android) → mượt hơn, không giật
    }).start();  // .start() bắt đầu chạy animation
  }, [fadeAnim]);
  // dependency array [fadeAnim]: useEffect chỉ chạy lại khi fadeAnim thay đổi
  // Vì fadeAnim là useRef → thực tế CHỈ CHẠY 1 LẦN khi component mount

  // --- MẢNG MÀU NỀN CHO ICON ---
  // 3 màu xoay vòng cho các icon danh mục: Hồng → Tím → Xanh → Hồng → ...
  // Gán bằng công thức: idx % 3
  //   Item 0 → Hồng (#E8A0BF)
  //   Item 1 → Tím  (#B9A1D1)
  //   Item 2 → Xanh (#ADD4ED)
  //   Item 3 → Hồng (quay lại)
  //   ...
  const CATEGORY_COLORS = ['#E8A0BF', '#B9A1D1', '#ADD4ED'];

  // =====================================================================
  // HÀM getCategoryIcon — Ánh xạ tên danh mục → icon tương ứng
  // =====================================================================
  // Tham số:
  //   - name (string): tên danh mục từ API, ví dụ "Chocolate", "Matcha"
  //   - color (string): màu nền — hiện CHƯA sử dụng (dự phòng cho tương lai)
  // Trả về: JSX Element — icon React Native component
  //
  // Cách hoạt động:
  //   1. Chuyển tên về chữ thường (toLowerCase) để so sánh không phân biệt hoa/thường
  //   2. Kiểm tra tên có chứa từ khóa không (includes) → trả về icon tương ứng
  //   3. Nếu không khớp từ khóa nào → trả về icon Cake (mặc định)
  const getCategoryIcon = (name: string, color: string) => {
    // Thuộc tính chung cho tất cả icon: kích thước 28px, màu trắng
    const iconProps = { size: 28, color: Colors.white };
    const n = name.toLowerCase();

    // Kiểm tra từ khóa trong tên và trả về icon tương ứng
    if (n.includes('tất cả')) return <Cake {...iconProps} />;                               // 🎂
    if (n.includes('bestseller')) return <Trophy {...iconProps} />;                          // 🏆
    if (n.includes('mới')) return <Sparkles {...iconProps} />;                               // ✨
    if (n.includes('mã giảm giá') || n.includes('khuyến mãi')) return <Ticket {...iconProps} />; // 🎫
    if (n.includes('chocolate')) return <Cookie {...iconProps} />;                           // 🍪
    if (n.includes('trái cây') || n.includes('fruit')) return <Apple {...iconProps} />;      // 🍎
    if (n.includes('matcha')) return <Leaf {...iconProps} />;                                // 🍃
    if (n.includes('cao cấp') || n.includes('premium')) return <Crown {...iconProps} />;    // 👑

    // Mặc định: icon Cake nếu tên không khớp từ khóa nào
    return <Cake {...iconProps} />;
  };

  // =====================================================================
  // PHÂN TRANG DỮ LIỆU
  // =====================================================================

  // Mỗi trang hiển thị tối đa 8 danh mục (lưới 4 cột × 2 hàng)
  const ITEMS_PER_PAGE = 8;

  // Tạo item "Tất cả" giả lập với id = undefined
  // Khi nhấn vào item này → onCategorySelect(null) → hiện tất cả sản phẩm
  const allItem: Category = { id: undefined, name: 'Tất cả' };

  // Ghép "Tất cả" vào ĐẦU danh sách danh mục từ API
  // Toán tử || xử lý trường hợp data = null/undefined → dùng mảng rỗng []
  // Ví dụ: enrichedData = ["Tất cả", "Chocolate", "Matcha", "Trái cây", ...]
  const enrichedData = [allItem, ...(data || [])];

  // Tính tổng số trang. Math.ceil làm tròn LÊN để trang cuối dù không đủ 8 items vẫn được tạo
  // Ví dụ: 11 items → Math.ceil(11/8) = Math.ceil(1.375) = 2 trang
  //   Trang 1: 8 items (index 0–7)
  //   Trang 2: 3 items (index 8–10)
  const pages = Math.ceil(enrichedData.length / ITEMS_PER_PAGE);

  // =====================================================================
  // HÀM onScrollEnd — Xử lý khi người dùng vuốt xong
  // =====================================================================
  // Được gọi bởi sự kiện onMomentumScrollEnd của ScrollView
  // (tức là khi cuộn dừng hẳn sau khi vuốt)
  //
  // Cách tính trang hiện tại:
  //   contentOffset.x = vị trí cuộn (pixel) từ trái
  //   Chia cho width (chiều rộng màn hình) → ra số trang
  //   Math.round làm tròn để xử lý sai số pixel nhỏ
  //
  // Ví dụ (màn hình rộng 390px):
  //   Trang 0: contentOffset.x ≈ 0   → 0/390 = 0   → pageIndex = 0
  //   Trang 1: contentOffset.x ≈ 390 → 390/390 = 1 → pageIndex = 1
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setPageIndex(index);
  };

  // --- EARLY RETURN: kiểm tra dữ liệu rỗng ---
  // Nếu không có danh mục (API chưa trả về hoặc danh sách rỗng)
  // → component không render gì cả (trả về null)
  // Ngăn lỗi khi data = undefined hoặc mảng rỗng
  if (!data || data.length === 0) return null;

  // =====================================================================
  // PHẦN RENDER JSX — Giao diện hiển thị
  // =====================================================================
  return (
    // --- Container chính bọc toàn bộ component ---
    <View style={styles.container}>

      {/* --- ScrollView cuộn ngang theo trang --- */}
      {/* horizontal: cuộn ngang (trái-phải) thay vì dọc */}
      {/* pagingEnabled: mỗi lần vuốt = đúng 1 "trang" (rộng = width màn hình) */}
      {/* showsHorizontalScrollIndicator={false}: ẩn thanh cuộn ngang mặc định */}
      {/* onMomentumScrollEnd: gọi hàm onScrollEnd khi cuộn dừng hẳn */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
      >
        {/* --- Lặp qua từng TRANG --- */}
        {/* Array.from({ length: pages }): tạo mảng có pages phần tử */}
        {/* Ví dụ: pages=2 → [undefined, undefined] → map với pIdx = 0, 1 */}
        {Array.from({ length: pages }).map((_, pIdx) => {
          // Tính vị trí bắt đầu & cắt ra 8 danh mục cho trang hiện tại
          // Trang 0: slice(0, 8) → items 0–7
          // Trang 1: slice(8, 16) → items 8–10 (nếu chỉ có 11 items)
          const startIndex = pIdx * ITEMS_PER_PAGE;
          const pageCategories = enrichedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

          return (
            // Mỗi trang rộng = width màn hình, có padding 2 bên 24px
            <View key={pIdx} style={styles.page}>
              {/* Lưới flexbox: row + wrap → xếp thành 4 cột, tự xuống hàng */}
              <View style={styles.grid}>

                {/* --- Lặp qua từng DANH MỤC trong trang --- */}
                {pageCategories.map((category, idx) => {

                  // Kiểm tra danh mục có đang được chọn không:
                  //   - Nếu category.id === undefined (item "Tất cả")
                  //     → chọn khi selectedCategory === null
                  //   - Còn lại → chọn khi selectedCategory === category.id
                  const isSelected =
                    category.id === undefined
                      ? selectedCategory === null
                      : selectedCategory === category.id;

                  // Gán màu nền xoay vòng: idx % 3 → Hồng/Tím/Xanh
                  const colorIndex = idx % CATEGORY_COLORS.length;
                  const bgColor = CATEGORY_COLORS[colorIndex];

                  return (
                    // Animated.View: wrapper có animation opacity (fade-in)
                    // key: dùng category.id, hoặc fallback "all-0" cho item "Tất cả"
                    //   Toán tử ?? (nullish coalescing): nếu id=undefined → dùng string thay thế
                    <Animated.View
                      key={category.id ?? `all-${idx}`}
                      style={[styles.itemWrapper, { opacity: fadeAnim }]}
                    >
                      {/* Nút bấm: khi nhấn → gọi onCategorySelect với id danh mục */}
                      {/* activeOpacity={0.7}: khi nhấn giữ → opacity giảm xuống 0.7 */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => onCategorySelect(category.id ?? null)}
                        style={styles.button}
                      >
                        {/* --- Ô chứa icon --- */}
                        {/* Khi được chọn (isSelected = true): */}
                        {/*   - shadowOpacity: 0.4 → bóng đổ đậm hơn (bình thường 0.1) */}
                        {/*   - scale: 1.05 → phóng to nhẹ 5% → tạo cảm giác "nổi lên" */}
                        <View
                          style={[
                            styles.iconContainer,
                            {
                              backgroundColor: bgColor,
                              shadowOpacity: isSelected ? 0.4 : 0.1,
                              transform: [{ scale: isSelected ? 1.05 : 1 }],
                            },
                          ]}
                        >
                          {/* Gọi hàm getCategoryIcon để lấy icon phù hợp với tên */}
                          {getCategoryIcon(category.name, bgColor)}
                        </View>

                        {/* --- Tên danh mục --- */}
                        {/* numberOfLines={2}: tối đa 2 dòng, nếu dài hơn sẽ cắt + "..." */}
                        {/* Khi chọn: chữ đậm (fontWeight 600) + màu đen (foreground) */}
                        {/* Khi không chọn: chữ mờ (mutedForeground) */}
                        <Text
                          style={[
                            styles.text,
                            isSelected ? styles.textSelected : styles.textUnselected,
                          ]}
                          numberOfLines={2}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}

              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* =====================================================================
          PAGINATION DOTS — Dấu chấm phân trang
          ===================================================================== */}
      {/* Chỉ hiển thị khi có hơn 1 trang (pages > 1) */}
      {/* Dấu chấm trang hiện tại (activeDot): dài 24px, màu primary (hồng) */}
      {/* Dấu chấm trang khác (inactiveDot): tròn 8px, màu xám nhạt */}
      {pages > 1 && (
        <View style={styles.pagination}>
          {Array.from({ length: pages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === pageIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// =====================================================================
// STYLESHEET — Định nghĩa kiểu dáng (styles) cho các phần tử
// =====================================================================
// StyleSheet.create tối ưu hóa styles cho React Native:
// - Chuyển styles thành ID number ở native side
// - Validate styles lúc compile, không phải lúc runtime
const styles = StyleSheet.create({
  // Container chính: khoảng cách phía dưới 24px (với phần HomeFilterPills)
  container: {
    marginBottom: 24,
  },

  // Mỗi trang: rộng = chiều rộng màn hình, padding 2 bên 24px
  // Kết hợp với pagingEnabled → mỗi lần vuốt = chuyển đúng 1 trang
  page: {
    width,
    paddingHorizontal: 24,
  },

  // Lưới: flexbox hàng ngang + tự xuống dòng (wrap)
  // justifyContent: 'flex-start' → xếp từ trái sang
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },

  // Mỗi item: chiếm 25% chiều ngang = 4 cột trên 1 hàng
  // marginBottom: 16 → khoảng cách giữa hàng 1 và hàng 2
  // alignItems: 'center' → căn giữa icon + text theo chiều ngang
  itemWrapper: {
    width: '25%', // 4 columns
    marginBottom: 16,
    alignItems: 'center',
  },

  // Nút bấm: căn giữa nội dung, rộng 100% trong itemWrapper
  button: {
    alignItems: 'center',
    width: '100%',
  },

  // Ô chứa icon: hình vuông 60×60, bo góc 20px (bo tròn mềm)
  // shadowColor/Offset/Radius/elevation: tạo bóng đổ nhẹ
  // overflow: 'hidden' → cắt bỏ phần icon tràn ra ngoài bo góc
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },  // Bóng lệch xuống 2px
    shadowRadius: 4,                         // Độ mờ bóng
    elevation: 2,                            // Bóng trên Android
    overflow: 'hidden',
  },

  // Style cho ảnh icon (hiện chưa sử dụng — dự phòng nếu dùng ảnh thay icon vector)
  imageIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',  // Ảnh lấp đầy ô, cắt bớt nếu tỉ lệ không khớp
  },

  // Text tên danh mục: cỡ 12px, căn giữa, padding ngang 4px tránh chữ sát mép
  text: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  // Text khi danh mục được chọn: chữ đậm hơn (600), màu đen đậm
  textSelected: {
    color: Colors.foreground,
    fontWeight: '600',
  },

  // Text khi danh mục KHÔNG được chọn: màu xám nhạt (muted)
  textUnselected: {
    color: Colors.mutedForeground,
  },

  // Hàng chứa các dấu chấm pagination: nằm ngang, căn giữa
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  // Style chung cho mỗi dấu chấm: cao 8px, bo tròn, cách nhau 4px
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // Dấu chấm trang ĐANG CHỌN: dài 24px (hình viên nhộng), màu hồng primary
  activeDot: {
    width: 24,
    backgroundColor: Colors.primary,
  },

  // Dấu chấm trang KHÔNG chọn: tròn 8x8px, màu xám mờ
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(150,150,150,0.3)',
  },
});
