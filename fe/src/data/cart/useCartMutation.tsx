import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/api/axiosIntance';  
import { toast } from '@medusajs/ui';  
import { QUERY_KEY } from '@/data/stores/key';

const useCartMutation = () => {
  const queryClient = useQueryClient(); 
  const addItemToCart = useMutation({
    mutationFn: (data: {
      userId: string;
      products: { productId: string; variantId: string; quantity: number }[];
    }) => instance.post('/cart/add-to-cart', data),

    onSuccess: () => {
      toast.success('Đã thêm sản phẩm vào giỏ hàng', {
        description: 'Sản phẩm của bạn đã được thêm vào giỏ hàng thành công!',
        duration: 1000,
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`, {
        description: 'Không thể thêm sản phẩm vào giỏ hàng, vui lòng thử lại.',
        duration: 2000,
      });
    },
  });
 
  const deleteItemFromCart = useMutation({
    mutationFn: ({
      userId,
      productIds,
    }: {
      userId: string;
      productIds: string[];
    }) =>
      instance.delete(`/cart/${userId}/product`, {
        data: { productIds },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`, {
        description: 'Không thể xóa sản phẩm khỏi giỏ hàng, vui lòng thử lại.',
        duration: 2000,
      });
    },
  });
 
  const deleteSelectedItemsFromCart = useMutation({
    mutationFn: async ({
      userId,
      selectedProductIds,
    }: {
      userId: string;
      selectedProductIds: string[];
    }) => {
      try {
        const response = await instance.delete(
          `/cart/${userId}/delete-selected-items`,
          {
            data: { selectedProductIds },
          }
        );
        return response.data;  
      } catch (error: any) {
        throw new Error(
          error?.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm'
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FETCH_CART] });
    },
    onError: (error: any) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`, {
        description:
          'Không thể xóa các sản phẩm đã chọn khỏi giỏ hàng, vui lòng thử lại.',
        duration: 2000,
      });
    },
  });
 
  const updateQuantity = useMutation({
    mutationFn: (data: {
      userId: string;
      productId: string;
      variantId: string;
      quantity: number;
    }) => instance.patch('/cart/update-quantity', data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`, {
        description: 'Không thể cập nhật số lượng, vui lòng thử lại.',
        duration: 2000,
      });
    },
  });
 
  const increaseQuantity = useMutation({
    mutationFn: (data: {
      userId: string;
      productId: string;
      variantId: string;
    }) => instance.patch('/cart/increase-quantity', data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
 
  const decreaseQuantity = useMutation({
    mutationFn: (data: {
      userId: string;
      productId: string;
      variantId: string;
    }) => instance.patch('/cart/decrease-quantity', data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    addItemToCart,
    deleteItemFromCart,
    deleteSelectedItemsFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
  };
};

export default useCartMutation;
