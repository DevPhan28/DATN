import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export default function useLoginMutation() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: Ilogin) =>
      instance.post<{
        status_code: number;
        error_code: string;
        user: string[];
      }>('/signin', {
        email,
        password,
      }),

    onSuccess: result => {
      if (result.data.status_code === 401) {
        toast.error('Login', {
          description: 'Login error',
        });
        return;
      }

      toast.success('Login', {
        description: 'Login successful',
      });

      localStorage.setItem('userId', result.data.user._id);
      // console.log('result', result);

      void navigate({ to: '/' });
    },

    onError: () => {
      toast.error('Login', {
        description: 'Login error',
      });
    },
  });

  return { loginMutation };
}
