import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/api/axiosIntance';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@medusajs/ui';

const useCheckoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createOrder = useMutation({
    mutationFn: data => instance.post('/orders', data),

    onSuccess: async result => {
      const { data } = result;

      if (typeof data === 'string' && data.includes('http')) {
        location.href = data;
      } else {
        const { orderId } = data;
        if (!orderId) {
          console.error('Order ID is missing in the response.');
          return;
        }
        await queryClient.invalidateQueries({ queryKey: ['cart'] });

        navigate({
          to: '/thanks',
          search: {
            status: '1',
            apptransid: `${orderId}-thanks`,
          },
        });
      }
    },

    onError: error => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ orderId, status }) =>
      instance.put(`/orders/${orderId}`, { status }),

    onSuccess: async () => {
      toast.success('Order status updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },

    onError: error => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  return { createOrder, updateOrderStatus };
};

export default useCheckoutMutation;
