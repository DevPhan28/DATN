import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/api/axiosIntance'; // Import axios instance cho việc gọi API
import { toast } from '@medusajs/ui'; // Import thư viện toast để hiển thị thông báo

// Hook để quản lý các mutation liên quan đến giỏ hàng
const useCartMutation = () => {
  const queryClient = useQueryClient(); // Sử dụng queryClient để invalidate dữ liệu khi cần

  // Mutation để thêm sản phẩm vào giỏ hàng (bao gồm cả biến thể)
  const addItemToCart = useMutation({
    mutationFn: (data: { userId: string; products: { productId: string; variantId: string; quantity: number }[] }) =>
      instance.post('/cart/add-to-cart', data), // Gọi API thêm sản phẩm vào giỏ hàng (đã sửa endpoint)

    onSuccess: () => {
      toast.success('Đã thêm sản phẩm vào giỏ hàng', {
        description: 'Sản phẩm của bạn đã được thêm vào giỏ hàng thành công!',
        duration: 2000, // Thời gian hiển thị thông báo
      });
      queryClient.invalidateQueries({
        queryKey: ['cart'], // Cú pháp mới trong React Query v5
      });
    },
    onError: (error) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`, {
        description: 'Không thể thêm sản phẩm vào giỏ hàng, vui lòng thử lại.',
        duration: 2000,
      });
    },
  });

  const deleteItemFromCart = useMutation({
    mutationFn: ({ userId, productId, variantId }: { userId: string; productId: string; variantId: string }) =>
      instance.delete(`/cart/${userId}/product/${productId}`, {
        data: { variantId }, // Truyền variantId trong body nếu cần
      }), // Gọi API xóa sản phẩm khỏi giỏ hàng

    onSuccess: () => {
      toast.success('Sản phẩm đã bị xóa khỏi giỏ hàng', {
        description: 'Sản phẩm của bạn đã bị xóa khỏi giỏ hàng thành công!',
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: ['cart'], // Cú pháp mới trong React Query v5
      });
    },
    onError: (error) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`, {
        description: 'Không thể xóa sản phẩm khỏi giỏ hàng, vui lòng thử lại.',
        duration: 2000,
      });
    },
  });


  // Mutation để cập nhật số lượng sản phẩm (bao gồm cả biến thể) trong giỏ hàng
  const updateQuantity = useMutation({
    mutationFn: (data: { userId: string; productId: string; variantId: string; quantity: number }) =>
      instance.patch('/cart/update-quantity', data), // Gọi API cập nhật số lượng sản phẩm (sửa thành PATCH)

    onSuccess: () => {
      toast.success('Cập nhật số lượng thành công', {
        description: 'Số lượng sản phẩm trong giỏ hàng của bạn đã được cập nhật.',
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: ['cart'], // Cú pháp mới trong React Query v5
      });
    },
    onError: (error) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`, {
        description: 'Không thể cập nhật số lượng, vui lòng thử lại.',
        duration: 2000,
      });
    },
  });

  return { addItemToCart, deleteItemFromCart, updateQuantity }; // Trả về các mutation để sử dụng trong các component khác
};

export default useCartMutation;
