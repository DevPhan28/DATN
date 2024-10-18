import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';

export default function useRegisterMutation() {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async (user: Iuser) => {
      try {
        const response = await instance.post('/signup', user);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          throw new Error(error.response.data?.message || 'Call API thất bại');
        } else {
          throw new Error('Đã xảy ra lỗi không xác định');
        }
      }
    },
    onSuccess: data => {
      toast.success('Đăng ký', {
        description: 'Đăng ký thành công',
      });
      void navigate({ to: '/login' });
    },
    onError: (error: Error) => {
      toast.error('Đăng ký thất bại', {
        description: error.message || 'Đã xảy ra lỗi trong quá trình đăng ký',
      });
    },
  });

  return { registerMutation };
}
