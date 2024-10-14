import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export default function useLoginMutation() {
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem('refreshToken');

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: Ilogin) =>
      instance.post<{
        status_code: number;
        error_code: string;
        refresh_token: string;
        access_token: string;
      }>(`/signin`, {
        email,
        password,
      }),

    onSuccess: result => {
      if (result.data.status_code === 401) {
        toast.success('Login', {
          description: 'Login error ',
        });
      }

      toast.success('Login', {
        description: 'Login successful',
      });

      localStorage.setItem('refreshToken', result.data.refresh_token);
      localStorage.setItem('accessToken', result.data.access_token);

      void navigate({ to: '/' });
    },

    onError: () => {
      toast.success('Login', {
        description: 'Login error',
      });
    },
  });

  return { loginMutation };
}
