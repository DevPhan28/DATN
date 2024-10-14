import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export default function useRegisterMutation() {
  const navigate = useNavigate();
  const registerMutation = useMutation({
    mutationFn: async (user: Iuser) => {
      try {
        const response = await instance.post('/signup', user);
        return response.data;
      } catch (error) {
        throw new Error('call api thất bại' + error);
      }
    },
    onSuccess: () => {
      toast.success('Register', {
        description: 'Registration successful',
      });
      navigate({ to: '/login' });
    },
  });

  return { registerMutation };
}
