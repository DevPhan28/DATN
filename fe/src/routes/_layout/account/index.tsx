import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ChevronRightMini } from '@medusajs/icons';
import instance from '@/api/axiosIntance';
import { Button, Input, toast } from '@medusajs/ui';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/_layout/account/')({
  component: AccountUser,
});

function AccountUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // state for saving status

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Iaccount>();

  const fetchUserInfo = async () => {
    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Gọi API với userId từ URL và thêm vào header
      const response = await instance.get(`/user/info/${userId}`, {
        headers: {
          'user-id': userId, // Thêm userId vào header
        },
      });

      // Kiểm tra xem response và response.data có hợp lệ không
      if (!response || !response.data || !response.data.user) {
        throw new Error(
          'Failed to fetch user information or user data is missing'
        );
      }

      setUser(response.data.user); // Lấy user từ response.data
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Gọi fetchUserInfo khi component mount
  }, []);

  const onSubmit = async data => {
    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

    if (!userId) {
      setError('User ID is missing');
      toast.error('User ID is missing'); // Toast thông báo lỗi
      return;
    }

    setIsSaving(true); // Đặt trạng thái lưu thay đổi đang diễn ra

    try {
      // Tạo đối tượng payload chứa các thông tin cần cập nhật
      const updateData: any = {
        username: data.username,
        email: data.email,
        avatar: data.avatar,
      };

      // Kiểm tra và chỉ gửi mật khẩu nếu người dùng muốn thay đổi
      if (data.oldPassword && data.newPassword && data.confirmPassword) {
        if (data.newPassword !== data.confirmPassword) {
          toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp'); // Toast thông báo lỗi
          setIsSaving(false);
          return;
        }
        updateData.oldPassword = data.oldPassword;
        updateData.newPassword = data.newPassword;
        updateData.confirmPassword = data.confirmPassword;
      }

      // Gửi API để cập nhật thông tin người dùng
      const response = await instance.put(
        `/user/update/${userId}`,
        updateData,
        {
          headers: {
            'user-id': userId, // Thêm userId vào header
          },
        }
      );

      // Kiểm tra mã trạng thái response để xác nhận yêu cầu thành công
      if (response.status >= 200 && response.status < 300) {
        toast.success('Cập nhật tài khoản thành công!'); // Toast thông báo thành công
        fetchUserInfo(); // Có thể refresh lại dữ liệu người dùng sau khi cập nhật thành công
      } else {
        // Nếu response không thành công, ném lỗi để xử lý trong catch
        throw new Error('Cập nhật tài khoản không thành công.');
      }
    } catch (err) {
      console.error(err);

      // Hiển thị thông báo lỗi từ backend hoặc mặc định
      if (err.response && err.response.data && err.response.data.message) {
        // Nếu có thông báo lỗi từ backend, hiển thị nó
        toast.error(
          err.response.data.message ||
            'Có lỗi khi cập nhật tài khoản. Vui lòng thử lại.'
        );
      } else {
        // Nếu không có thông báo từ backend, hiển thị thông báo mặc định
        toast.error(
          err.message || 'Có lỗi khi cập nhật tài khoản. Vui lòng thử lại.'
        );
      }
    } finally {
      setIsSaving(false); // Đảm bảo cập nhật lại trạng thái khi hoàn thành
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user information available</div>;
  }

  return (
    <div className="main-content flex h-auto w-full flex-col items-center justify-center bg-gray-50 p-5">
      <div className="main-content flex h-48 w-full flex-col items-center justify-center">
        <div className="text-content">
          <div className="text-center text-4xl font-semibold">
            Tài khoản của tôi
          </div>
          <div className="link caption1 mt-3 flex items-center justify-center gap-1">
            <div className="flex items-center justify-center">
              <a href="/">Home</a>
              <ChevronRightMini />
            </div>
            <div className="capitalize text-gray-500">
              <Link to="/account">Tài khoản của tôi</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="account-user mx-auto mt-8 w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-3xl font-semibold text-gray-800">
          Thông tin tài khoản
        </h2>

        <form
          className="user-info-form space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-group">
            <label
              htmlFor="username"
              className="text-lg font-medium text-gray-700"
            >
              Tên người dùng
            </label>
            <Input
              type="text"
              id="username"
              {...register('username', { required: 'Username bắt buộc' })}
              defaultValue={user.username}
              className="form-control w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email bắt buộc',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Email sai định dạng',
                },
              })}
              defaultValue={user.email}
              className="form-control w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Các ô mật khẩu */}
          <div className="form-group">
            <label
              htmlFor="old-password"
              className="text-lg font-medium text-gray-700"
            >
              Mật khẩu cũ
            </label>
            <Input
              type="password"
              id="old-password"
              {...register('oldPassword', {
                required:
                  (watch('newPassword') || watch('confirmPassword')) &&
                  'Mật khẩu cũ là bắt buộc', // Chỉ yêu cầu nếu đổi mật khẩu mới
              })}
              className="form-control w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.oldPassword && (
              <p className="text-sm text-red-500">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="new-password"
              className="text-lg font-medium text-gray-700"
            >
              Mật khẩu mới
            </label>
            <Input
              type="password"
              id="new-password"
              {...register('newPassword', {
                required:
                  (watch('confirmPassword') && 'Mật khẩu mới là bắt buộc') ||
                  false, // Chỉ yêu cầu nếu nhập mật khẩu xác nhận
                minLength: {
                  value: 6,
                  message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
                },
              })}
              className="form-control w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="confirm-password"
              className="text-lg font-medium text-gray-700"
            >
              Nhập lại mật khẩu mới
            </label>
            <Input
              type="password"
              id="confirm-password"
              {...register('confirmPassword', {
                required:
                  (watch('newPassword') && 'Xác nhận mật khẩu là bắt buộc') ||
                  false, // Chỉ yêu cầu nếu nhập mật khẩu mới
                validate: (value, { newPassword }) =>
                  value === newPassword || 'Mật khẩu xác nhận không khớp',
              })}
              className="form-control w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="form-group text-center">
            <Button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSaving}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountUser;
