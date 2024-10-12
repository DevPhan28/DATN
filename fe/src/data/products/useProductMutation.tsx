import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/data/stores/key.ts';
import instance from '@/api/axiosIntance';
import { useNavigate } from '@tanstack/react-router';

const useProductMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: (data: {
      name: string;
      price: number;
      image: string;
      category: string[];
      gallery?: string[];
      description: string;
      discount: number;
      variants: Variant[];
    }) => instance.post<{ id: string }>('/products', data),

    onSuccess: async result => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_PRODUCT],
      });

      void navigate({
        to: '/dashboard/products',
      });
      // setProductId(result.data.id)
      // setStep((prev) => Math.min(prev + 1, 2))

      return result;
    },
  });

  return { createProduct };
};

export default useProductMutation;
