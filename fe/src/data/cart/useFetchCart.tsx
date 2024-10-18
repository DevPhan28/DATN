import { useQuery } from '@tanstack/react-query';
import instance from '@/api/axiosIntance'; // Đảm bảo đường dẫn axiosInstance đúng

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng
interface CartProduct {
  id: string; // Sử dụng string vì ID thường là ObjectId hoặc chuỗi
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantId: string;
  size: string;
  color: string;
}

// Định nghĩa kiểu dữ liệu cho giỏ hàng
interface CartData {
  products: CartProduct[];
}

// Hàm fetch giỏ hàng từ API
const fetchCart = async (userId: string): Promise<CartData> => {
  try {
    const response = await instance.get(`/cart/${userId}`);
    return response.data; // Giả định rằng response trả về cấu trúc phù hợp với CartData
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi fetch giỏ hàng');
  }
};

// Hook để lấy dữ liệu giỏ hàng
export const useFetchCart = (userId: string) => {
  return useQuery<CartData>({
    queryKey: ['cart', userId], // Sử dụng array để xác định key
    queryFn: () => fetchCart(userId),
    enabled: !!userId, // Chỉ thực hiện khi có userId
    retry: 1, // Retry 1 lần nếu có lỗi
    refetchOnWindowFocus: false, // Không tự động fetch lại khi chuyển qua lại giữa các cửa sổ
    staleTime: 1000 * 60 * 5, // Dữ liệu có thể cũ sau 5 phút
  });
};
