import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/data/stores/key.ts';
import instance from '@/api/axiosIntance';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@medusajs/ui';


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

    onSuccess: async (result) => {
      toast.success('Create successful', {
        description: 'Create products successful',
        duration: 1000,
      });

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

  const deleteProduct = useMutation({
    mutationFn: async (_id: string) => {
      try {
        return await instance.delete(`/products/${_id}`)
      } catch (error) {
        throw new Error("call api thất bại")
      }
    },
    onSuccess: async (result) => {
      toast.success('Delete successful', {
        description: 'Delete products successful',
        duration: 1000,
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_PRODUCT],
      });

      // setProductId(result.data.id)
      // setStep((prev) => Math.min(prev + 1, 2))

      return result;
    },
  });

  const editProduct = useMutation({
    mutationFn: async (data: Product) => {
      if (!data._id) {
        throw new Error("Cần có ID sản phẩm để chỉnh sửa.");
      }
      try {
        const response = await instance.put(`/products/${data._id}`, data);
        return response.data;
      } catch (error) {
        console.error("Lỗi khi gọi API chỉnh sửa sản phẩm:", error);
      }
    },

    onSuccess: async (result) => {
      toast.success('Edit successful', {
        description: 'Edit products successful!',
        duration: 1000,
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_PRODUCT],
      });

      void navigate({
        to: '/dashboard/products',
      });

      return result;
    },
    onError: (error) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    },
  });

  return { editProduct, createProduct, deleteProduct };
};

export default useProductMutation;
