import instance from '@/api/axiosIntance';
import { Input, toast } from '@medusajs/ui';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/_layout/profile/')({
  component: ProfileUser,
});

function ProfileUser() {
  const [user, setUser] = useState<Iaccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<Iaccount>({
    mode: 'onChange',
  });

  // Lấy thông tin user từ API
  const fetchUserInfo = async () => {
    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await instance.get(`/user/info/${userId}`, {
        headers: {
          'user-id': userId,
        },
      });

      if (!response || !response.data || !response.data.user) {
        throw new Error(
          'Không thể lấy thông tin người dùng hoặc dữ liệu bị thiếu'
        );
      }

      const userData = response.data.user;
      setUser(userData);
      setValue('username', userData.username);
      setValue('email', userData.email);
      setValue('phone', userData.phone);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Xử lý submit form
  const onSubmit = async (data: any) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.error('User ID is missing');
      return;
    }

    setIsSaving(true);

    try {
      // Gửi dữ liệu cập nhật tới backend
      await instance.put(
        '/user/update',
        { ...data, userId }, // Thêm userId vào body
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Cập nhật thông tin thành công!');
      await fetchUserInfo(); // Gọi lại API để tải thông tin mới
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          'Có lỗi khi cập nhật tài khoản. Vui lòng thử lại.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Không có thông tin người dùng nào có sẵn</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg">
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <img
              src="https://res.cloudinary.com/dlzhmxsqp/image/upload/v1716288330/e_commerce/s4nl3tlwpgafsvufcyke.jpg"
              alt=""
              className="size-8 rounded-full object-cover"
            />
            <span className="font-semibold">
              {user.username || 'Tên người dùng'}
            </span>
          </div>
          <ul>
            <li>
              <Link
                to="/change_password"
                className="mb-4 cursor-pointer text-gray-600 hover:text-blue-500"
              >
                Đổi mật khẩu
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="mb-4 cursor-pointer text-gray-600 hover:text-blue-500"
              >
                Địa chỉ
              </Link>
            </li>
            <li>
              <Link
                to="/orderuser"
                className="cursor-pointer text-gray-600 hover:text-blue-500"
              >
                Đơn mua
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="mb-6 text-2xl font-semibold">Hồ Sơ Của Tôi</h1>
        <p className="mb-6 text-gray-600">
          Quản lý thông tin hồ sơ để bảo mật tài khoản của bạn
        </p>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block font-medium text-gray-700">Tên</label>
              <Input
                type="text"
                {...register('username', { required: 'Tên là bắt buộc' })}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700">Email</label>
              <Input
                type="email"
                {...register('email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email không hợp lệ',
                  },
                })}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                Số điện thoại
              </label>
              <Input
                type="text"
                {...register('phone', {
                  required: 'Số điện thoại là bắt buộc',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message:
                      'Số điện thoại không hợp lệ (chỉ chứa tối đa 10-11 chữ số)',
                  },
                })}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!isValid || isSaving}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : 'Cập nhật'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ProfileUser;
