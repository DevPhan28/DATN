import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/data/stores/key.ts';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@medusajs/ui';
import instance from '@/api/axiosIntance';

const useCouponMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Tạo mã giảm giá
  const createCoupon = useMutation({
    mutationFn: (data: {
      code: string;
      discount: number;
      expirationDate: string;
      isActive: boolean;
      isFreeShipping: boolean;
    }) => instance.post<{ id: string }>('/create-coupon', data),

    onSuccess: async (result) => {
      toast.success('Create successful', {
        description: 'Create coupon successful',
        duration: 1000,
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_COUPONS],
      });

      void navigate({
        to: '/dashboard/coupon',
      });

      return result;
    },
    onError: (error) => {
      toast.error(`Error creating coupon: ${error.message}`);
    },
  });

  // Xóa mã giảm giá
  const deleteCoupon = useMutation({
    mutationFn: async (_id: string) => {
      try {
        return await instance.delete(`/delete-coupon/${_id}`);
      } catch (error) {
        throw new Error('API call failed');
      }
    },
    onSuccess: async () => {
      toast.success('Delete successful', {
        description: 'Delete coupon successful',
        duration: 1000,
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_COUPONS],
      });
    },
    onError: (error) => {
      toast.error(`Error deleting coupon: ${error.message}`);
    },
  });

  // Chỉnh sửa mã giảm giá
  const editCoupon = useMutation({
    mutationFn: async (data: {
      _id: string;
      code: string;
      discount: number;
      expirationDate: string;
      isActive: boolean;
      isFreeShipping: boolean;
    }) => {
      const { _id, ...updateData } = data;
      const response = await instance.put(`/update-coupon/${_id}`, updateData);
      console.log("Response data:", response.data);  // Kiểm tra phản hồi từ API
      return response.data;
    },
    onSuccess: () => {
      toast.success("Coupon updated successfully");
      queryClient.invalidateQueries(['coupon']);
    },
    onError: (error) => {
      toast.error(`Error updating coupon: ${error.message}`);
    },
  });
  
  return { createCoupon, deleteCoupon, editCoupon };
};

export default useCouponMutation;
