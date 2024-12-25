import useRegisterMutation from '@/data/auth/useRegisterMutation';
import { Button, Input } from '@medusajs/ui';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/register')({
  component: Register,
});

function Register() {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<Iuser>();

  const { registerMutation } = useRegisterMutation();

  const onSubmit = (data: Iuser) => {
    const userData = { ...data };
    console.log(data); // Log dữ liệu gửi đi để kiểm tra
    setRegisterError(null);
    setRegisterSuccess(null);

    registerMutation.mutate(userData, {
      onSuccess: () => {
        setRegisterSuccess(
          'Đăng ký thành công! Chào mừng bạn đến với Fashion Zone'
        );
      },
      onError: (error: any) => {
        if (error?.response?.data?.field && error?.response?.data?.message) {
          const { field, message } = error.response.data;
          setError(field as keyof Iuser, {
            type: 'manual',
            message,
          });
        } else {
          setRegisterError('Đăng ký thất bại. Vui lòng thử lại!');
        }
      },
    });
  };

  const password = watch('password');
  const usernameNoAccentRegex = /^[a-zA-Z0-9_]+$/;

  return (
    <div className="relative h-screen w-full overflow-y-auto">
      {/* Hình nền */}
      <img
        src="/image.png"
        alt="background-register"
        className="absolute z-0 h-full w-full object-cover"
      />

      {/* Overlay với nội dung */}
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10 px-6 py-6 md:flex-row md:items-end md:gap-40 md:pl-20 md:pr-10">
        {/* Phần trái với nội dung */}
        <div className="w-full space-y-5 text-center text-ui-bg-base md:mt-auto md:w-1/2 md:text-left">
          <p className="text-header-login-1 font-bold">
            Mua sắm trực tuyến dễ dàng tại Fashion Zone
          </p>
          <p className="txt-large">
            Khám phá các bộ sưu tập thời trang mới nhất, dễ dàng mua sắm và nhận
            hàng tại nhà. Chúng tôi cung cấp những sản phẩm chất lượng với giá
            cả hợp lý cho mọi phong cách!
          </p>
        </div>

        {/* Phần phải với form đăng ký */}
        <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-ui-bg-base px-8 py-10 shadow-lg md:w-1/2 md:px-16">
          {/* Logo */}
          <img
            src="./fasion zone.png"
            alt="fashionzone-logo"
            className="w-40 p-4"
          />

          {/* Thông điệp chào mừng */}
          <div className="mb-8 space-y-1 text-center">
            <p className="txt-compact-large text-ui-fg-subtle">
              Chào mừng bạn đến với Fashion Zone
            </p>
            <p className="text-header-web-2 font-semibold text-ui-fg-base">
              Tạo tài khoản
            </p>
          </div>

          {/* Form đăng ký */}
          <form
            onSubmit={e => void handleSubmit(onSubmit)(e)}
            className="w-full space-y-6 md:space-y-10"
          >
            {/* Các trường nhập liệu */}
            <div className="space-y-4">
              {/* Tên người dùng */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="user">Tên người dùng</label>
                <Input
                  id="user"
                  aria-label="Tên người dùng"
                  {...register('username', {
                    required: 'Tên người dùng là bắt buộc',
                    validate: {
                      noWhitespace: value =>
                        !/\s/.test(value) ||
                        'Tên người dùng không được chứa khoảng trắng',
                      noAccent: value =>
                        usernameNoAccentRegex.test(value) ||
                        'Tên người dùng không được chứa dấu',
                    },
                  })}
                  placeholder="Nhập tên người dùng của bạn"
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  aria-label="Email"
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message:
                        'Định dạng email không hợp lệ hoặc chứa khoảng trắng',
                    },
                  })}
                  placeholder="Nhập email của bạn"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="phone">Số điện thoại</label>
                <Input
                  id="phone"
                  aria-label="Số điện thoại"
                  {...register('phone', {
                    required: 'Số điện thoại là bắt buộc',
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: 'Số điện thoại không hợp lệ!',
                    },
                  })}
                  placeholder="Nhập số điện thoại của bạn"
                />
                {errors.phone && (
                  <p className="text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Mật khẩu */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="password">Mật khẩu</label>
                <Input
                  id="password"
                  aria-label="Mật khẩu"
                  type="password"
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    },
                  })}
                  placeholder="Nhập mật khẩu của bạn"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <Input
                  id="confirmPassword"
                  aria-label="Xác nhận mật khẩu"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Xác nhận mật khẩu là bắt buộc',
                    validate: value =>
                      value === password || 'Mật khẩu xác nhận không khớp',
                  })}
                  placeholder="Xác nhận mật khẩu của bạn"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Lỗi chung */}
            {registerError && (
              <div className="text-center text-red-500">{registerError}</div>
            )}

            {/* Thành công */}
            {registerSuccess && (
              <div className="text-center text-green-500">
                {registerSuccess}
              </div>
            )}

            {/* Nút đăng ký */}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Đăng ký
            </Button>
          </form>

          {/* Liên kết đăng nhập */}
          <p className="txt-compact-large mt-6 text-ui-fg-subtle">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập ngay!
            </Link>{' '}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
