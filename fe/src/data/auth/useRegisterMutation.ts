import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';

// Định nghĩa kiểu dữ liệu phản hồi (tuỳ chỉnh nếu cần)
interface RegisterResponse {
  status_code: number;
  message: string;
  token?: string; // Thêm nếu API trả về token
  user?: { _id: string; role: string }; // Bao gồm thông tin người dùng nếu cần
}

export default function useRegisterMutation() {
  const navigate = useNavigate();

  const registerMutation = useMutation<RegisterResponse, Error, Iuser>({
    mutationFn: async (user: Iuser) => {
      try {
        const response = await instance.post<RegisterResponse>('/signup', user);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          throw new Error(error.response.data?.message || 'Đăng ký thất bại');
        } else {
          throw new Error('Đã xảy ra lỗi không xác định');
        }
      }
    },
    onSuccess: data => {
      toast.success('Đăng ký', {
        description: 'Đăng ký thành công',
      });

      // Tuỳ chọn: Lưu token nếu được cung cấp từ server
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
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
