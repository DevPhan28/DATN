import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/api/axiosIntance';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@medusajs/ui';
import { updatePaymentStatus } from './usePayment';

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
        const { orderId, orderItems } = data;

        if (!orderId) {
          console.error('Order ID is missing in the response.');
          return;
        }

        for (const item of orderItems) {
          const product = await instance.get(`/products/${item.productId}`);
          if (product.data.countInStock < item.quantity) {
            toast.error(
              `Sản phẩm ${product.data.name} không đủ số lượng trong kho.`
            );
            return;
          }
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
