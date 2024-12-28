import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@medusajs/ui';
import instance from '@/api/axiosIntance';

const useCustomerMutation = () => {
  const queryClient = useQueryClient();

  // Tạo mới khách hàng
  const createCustomer = useMutation({
    mutationFn: async (data) => {
      return instance.post('/create-customer', data);
    },
    onSuccess: async (result) => {
      toast.success('Thêm địa chỉ thành công!', {
        description: 'Địa chỉ đã được thêm thành công.',
        duration: 1000,
      });
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      return result;
    },
    onError: (error) => {
      toast.error(`Lỗi khi thêm địa chỉ: ${error.message}`);
    },
  });
  

  // Chỉnh sửa thông tin khách hàng
  const editCustomer = useMutation({
    mutationFn: async (data) => {
      const { id, userId, ...updateData } = data;
      // Sử dụng đường dẫn chính xác
      return instance.put(`/edit-customer/${id}/${userId}`, updateData);
    },
    onSuccess: async () => {
      toast.success('Cập nhật thông tin khách hàng thành công!', {
        duration: 1000,
      });
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật thông tin khách hàng: ${error.message}`);
    },
  });
  
  // Xóa khách hàng
  const deleteCustomer = useMutation({
    mutationFn: async ({ id }) => {
      return instance.delete(`/delete-customer/${id}`);
    },
    onSuccess: async () => {
      toast.success('Xóa khách hàng thành công!', {
        duration: 1000,
      });
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      toast.error(`Lỗi khi xóa khách hàng: ${error.message}`);
    },
  });

  return { createCustomer, editCustomer, deleteCustomer };
};

export default useCustomerMutation;
