import { useQuery } from '@tanstack/react-query';
import instance from '@/api/axiosIntance'; 

export interface CartProduct {
  productId: string; 
  variantId: string;
  name: string;
  price: number;
  priceAtTime?: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}


interface CartData {
  products: CartProduct[];
}


const fetchCart = async (userId: string): Promise<CartData> => {
  try {
    const response = await instance.get(`/cart/${userId}`);
    return response.data; 
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi fetch giỏ hàng');
  }
};


export const useFetchCart = (userId: string) => {
  return useQuery<CartData>({
    queryKey: ['cart', userId], 
    queryFn: () => fetchCart(userId),
    enabled: !!userId, 
    retry: 1, 
    refetchOnWindowFocus: false, 
    staleTime: 1000 * 60 * 5, 
  });
};
