import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore";
import { reviewService } from "../api/reviewService";

export function useReviewForm(
  productId: string | undefined,
  orderId: string | undefined,
) {
  const router = useRouter();

  //auth
  const user = useAuthStore(useShallow((state) => state.user));
  const {
    getProductById,
    currentProduct: product,
    isLoadingProduct,
  } = useProductStore(
    useShallow((state) => ({
      getProductById: state.getProductById,
      currentProduct: state.currentProduct,
      isLoadingProduct: state.isLoading,
    })),
  );
//tối ưu hóa hiệu suất 
  const { orders, fetchOrders, isLoadingOrders } = useOrderStore(
    useShallow((state) => ({
      orders: state.orders,
      fetchOrders: state.fetchOrders,
      isLoadingOrders: state.isLoading,
    })),
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isLoading = isLoadingProduct || isLoadingOrders;

  useEffect(() => {
    if (productId) getProductById(productId);
    if (orders.length === 0) fetchOrders();
  }, [productId, getProductById, fetchOrders, orders.length]);

  const order = orders.find((o) => String(o.id) === orderId);

  const validate = (): string | null => {
    if (!user) return "Vui lòng đăng nhập để đánh giá";
    if (!order) return "Không tìm thấy đơn hàng";
    if (order.user_id !== user.id)
      return "Bạn không có quyền đánh giá đơn hàng này";
    if (order.status !== "COMPLETED")
      return "Bạn cần mua và nhận hàng thành công để đánh giá";
    const hasProduct = order.items?.some(
      (item) => item.product_id === Number(productId),
    );
    if (!hasProduct) return "Sản phẩm không có trong đơn hàng này";
    if (rating === 0) return "Vui lòng chọn số sao đánh giá";
    if (comment.trim().length < 10)
      return "Nội dung đánh giá phải có ít nhất 10 ký tự";
    return null;
  };

  const handleImageUpload = () => {
    if (images.length >= 5) {
      setError("");
      return;
    }

    Alert.alert("Tải ảnh lên", "Bạn muốn lấy ảnh từ đâu?", [
      {
        text: "Chụp ảnh",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Lỗi",
              "Ứng dụng cần quyền truy cập camera để chụp ảnh",
            );
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.7,
            base64: true,
          });
          if (!result.canceled && result.assets[0].base64) {
            const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setImages((prev) => [...prev, base64Img]);
          }
        },
      },
      {
        text: "Chọn từ thư viện",
        onPress: async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Lỗi",
              "Ứng dụng cần quyền truy cập thư viện để chọn ảnh",
            );
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
            base64: true,
          });
          if (!result.canceled && result.assets[0].base64) {
            const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setImages((prev) => [...prev, base64Img]);
          }
        },
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  };

  const handleSubmit = async () => {
    setError("");
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    if (!product?.id) return;
    if (!order?.id) return;

    setIsSubmitting(true);
    try {
      await reviewService.createReview(product.id, {
        orderId: order.id,
        rating,
        comment: comment.trim() || undefined,
        image: images[0] ?? undefined,
      });
      setShowSuccess(true);
      setTimeout(() => {
        router.canGoBack() ? router.back() : router.push("/orders" as any);
      }, 1500);
    } catch {
      setError("Gửi đánh giá thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationMsg = validate();
  const blockerMsg =
    !user || !order || order.user_id !== user.id || order.status !== "COMPLETED"
      ? validationMsg
      : null;

  return {
    router,
    product,
    isLoading,
    rating,
    setRating,
    comment,
    setComment,
    images,
    setImages,
    error,
    isSubmitting,
    showSuccess,
    blockerMsg,
    handleImageUpload,
    handleSubmit,
  };
}
