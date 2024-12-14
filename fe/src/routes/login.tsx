import useLoginMutation from '@/data/auth/useLoginMutation';
import { Button, Input } from '@medusajs/ui';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (localStorage.getItem('user')) {
      throw redirect({ to: '/' });
    }
  },
  component: Login,
});

function Login() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Ilogin>();
  const { loginMutation } = useLoginMutation();

  const onSubmit = (data: Ilogin) => {
    const userData = { ...data };
    setLoginError(null);
    loginMutation.mutate(userData, {
      onError: (error: any) => {
        setLoginError(
          error?.response?.data?.message ||
            'Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu của bạn'
        );
      },
    });
  };

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
            Tinh gọn trải nghiệm mua sắm của bạn
          </p>
          <p className="txt-large">
            Khám phá những bộ sưu tập thời trang mới nhất, dễ dàng đặt hàng và
            nhận ngay các ưu đãi đặc biệt chỉ có tại cửa hàng của chúng tôi!
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
                Chào mừng bạn đến với Fashion Zone
              </p>
              <p className="text-header-web-2 font-semibold text-ui-fg-base">
                Đăng nhập vào tài khoản của bạn
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {/* Email input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  aria-label="Email"
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Định dạng email không hợp lệ hoặc có dấu cách',
                    },
                  })}
                  placeholder="Nhập email của bạn"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password input */}
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
            </div>
            {loginError && (
              <div className="text-center text-red-500">{loginError}</div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Đăng nhập
            </Button>
          </form>

          {/* Forgot password */}
          <p className="txt-compact-large mt-6 text-ui-fg-subtle">
            <Link to="/forgot-password">Quên mật khẩu? </Link>
            <Link className="text-blue-600 hover:underline" to="/register">
              Bạn chưa có tài khoản?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
