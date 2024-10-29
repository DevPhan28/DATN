import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/data/stores/key.ts';
import instance from '@/api/axiosIntance';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@medusajs/ui';

const useCheckoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createOrder = useMutation({
    mutationFn: (data) => instance.post('/orders', data), // Tạo đơn hàng

    onSuccess: async (result) => {
      toast.success('Checkout successful', {
        description: 'Order has been placed successfully!',
        duration: 1000,
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_CART],
      });

      void navigate({
        to: '/',
      });

      return result;
    },

    onError: (error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });

  return { createOrder };
};

export default useCheckoutMutation;