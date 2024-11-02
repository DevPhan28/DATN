import {
  checkValidCode,
  fetchUpdateNewPassword,
} from '@/data/auth/useResetPassword';
import { Button, Input } from '@medusajs/ui';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export const Route = createFileRoute('/reset-password')({
  component: UpdatePassword,
});

function UpdatePassword() {
  const navigate = Route.useNavigate();
  const [isValidCode, setIsValidCode] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>();

  const { code } = Route.useSearch<{ code: string }>();

  if (!code) return;

  const onSubmit: SubmitHandler<{
    password: string;
    confirmPassword: string;
  }> = async data => {
    try {
      await fetchUpdateNewPassword(data.password);

      console.log('Đang xóa dữ liệu đăng nhập...');

      // Xóa tất cả các key liên quan đến đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userId');

      console.log(
        'Token sau khi xóa:',
        localStorage.getItem('token'),
        sessionStorage.getItem('token')
      );

      // Chuyển hướng đến trang đăng nhập sau khi xóa
      navigate({ to: '/login' });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await checkValidCode(code);
      console.log(response);

      if (response === 'Token Valid') {
        setIsValidCode(true);
      } else if (response === 'Token expired') {
        navigate({ to: '/token-expires' });
      } else {
        console.log('Phản hồi không xác định:', response);
      }
    })();
  }, [code, navigate]);

  if (!isValidCode) return null;

  const password = watch('password');

  return (
    <div className="relative h-screen w-full">
      {/* Background image */}
      <img
        src="/image.png"
        alt="background-login"
        className="absolute z-0 h-full w-full object-cover"
      />

      {/* Overlay with content */}
      <div className="relative flex h-full w-full flex-col items-center justify-between gap-10 px-6 py-6 md:flex-row md:items-end md:gap-40 md:pl-20 md:pr-10">
        {/* Left section with text */}
        <div className="w-full space-y-5 text-center text-ui-bg-base md:w-1/2 md:text-left">
          <p className="text-header-login-1 font-bold">
            Streamline your workflow
          </p>
          <p className="txt-large">
            Access your dashboard to manage your brand, sales, and performance
            with ease!
          </p>
        </div>

        {/* Right section with form */}
        <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-ui-bg-base px-8 py-10 shadow-lg md:w-1/2 md:px-16">
          {/* Logo */}
          <img
            src="./fasion zone.png"
            alt="fashionzone-logo"
            className="mb-6 w-24 object-cover md:mb-8 md:w-32"
          />

          {/* Form section */}
          <form
            onSubmit={e => void handleSubmit(onSubmit)(e)}
            className="w-full space-y-6 md:space-y-10"
          >
            {/* Welcome message */}
            <div className="space-y-1 text-center">
              <p className="txt-compact-large text-ui-fg-subtle">
                Welcome to Fashion Zone
              </p>
              <p className="text-header-web-2 font-semibold text-ui-fg-base">
                Reset password to your account
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {/* Password input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="password">Nhập mật khẩu mới</label>
                <Input
                  id="password"
                  type="password"
                  aria-label="password"
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    },
                  })}
                  placeholder="Nhập mật khẩu mới"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  aria-label="confirmPassword"
                  {...register('confirmPassword', {
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: value =>
                      value === password || 'Mật khẩu không khớp',
                  })}
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Đặt lại mật khẩu
            </Button>
          </form>

          {/* Back to login page */}
          <p className="txt-compact-large mt-6 text-ui-fg-subtle">
            <Link className="text-blue-600 hover:underline" to="/login">
              Quay lại trang đăng nhập!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
