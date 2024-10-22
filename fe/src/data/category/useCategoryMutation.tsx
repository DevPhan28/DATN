import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/data/stores/key.ts';
import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';
import { useNavigate } from '@tanstack/react-router';

// Hook để thực hiện CRUD cho danh mục
const useCategoryMutation = (
  setCategoryId?: React.Dispatch<React.SetStateAction<string>>,
  setStep?: React.Dispatch<React.SetStateAction<number>>
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // Tạo danh mục (Create Category)
  const createCategory = useMutation({
    mutationFn: (data: Category) => instance.post('/categories', data),

    onSuccess: async result => {
      toast.success('Create successful', {
        description: 'Create category successful!',
        duration: 1000,
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_CATEGORIES],
      });

      void navigate({
        to: '/dashboard/category',
      });

      return result;
    },
  });

  // Cập nhật danh mục (Update Category)
  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Category }) =>
      instance.put(`/categorys/${id}`, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_CATEGORIES],
      });
    },
  });

  // Xóa danh mục (Delete Category)
  const deleteCategory = useMutation({
    mutationFn: (id: string) => instance.delete(`/categories/${id}`),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_CATEGORIES],
      });
    },
  });

  return { createCategory, updateCategory, deleteCategory };
};

export default useCategoryMutation;
