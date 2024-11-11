import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@medusajs/ui';
import instance from '@/api/axiosIntance';
import { QUERY_KEY } from '../stores/key';
import { useNavigate } from '@tanstack/react-router';

const useCommentMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Thêm bình luận
  const createComment = useMutation({
    mutationFn: (data: {
      userId: string;
      productId: string;
      content: string;
      rating: number; // Thêm rating vào dữ liệu gửi đi
    }) => instance.post('/comments', data),

    onSuccess: async (response) => {
      const { productId } = response.data; // Truy cập productId từ dữ liệu phản hồi
      toast.success('Comment added successfully!', {
        description: 'Your comment has been posted.',
        duration: 1000,
      });

      // Refresh comments data cho sản phẩm
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_COMMENT_BY_PRODUCT, productId],
      });
      
      // Optionally, refetch to ensure the latest data is fetched immediately after mutation
      // queryClient.refetchQueries({
      //   queryKey: [QUERY_KEY.FETCH_COMMENT_BY_PRODUCT, productId],
      //   active: true,
      // });

      return response;
    },
    onError: (error: any) => {
      toast.error(`Error adding comment: ${error.message}`, {
        description: 'Please try again later.',
      });
    },
  });

  // Xóa bình luận
  const removeComment = useMutation({
    mutationFn: (commentId: string) => {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage (hoặc sessionStorage nếu dùng)

      if (!token) {
        throw new Error('No token found');
      }

      return instance.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
        },
      });
    },

    onSuccess: async (response) => {
      const { productId } = response.data; // Truy cập productId từ dữ liệu phản hồi
      toast.success('Comment deleted successfully!', {
        description: 'Your comment has been deleted.',
        duration: 1000,
      });

      // Refresh comments data cho sản phẩm
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FETCH_COMMENT_BY_PRODUCT, productId],
      });

      // Optionally, refetch to ensure the latest data is fetched immediately after deletion
      // queryClient.refetchQueries({
      //   queryKey: [QUERY_KEY.FETCH_COMMENT_BY_PRODUCT, productId],
      //   active: true,
      // });

      return response;
    },
    onError: (error: any) => {
      toast.error(`Error deleting comment: ${error.message}`, {
        description: 'Please try again later.',
      });
    },
  });
  
  

  return { createComment, removeComment };
};

export default useCommentMutation;
