import Header from '@/components/header';
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
    setError, // Hàm gán lỗi vào trường cụ thể
    formState: { errors },
  } = useForm<Ilogin>();

  const { loginMutation } = useLoginMutation();

  const onSubmit = (data: Ilogin) => {
    const userData = { ...data };
    setLoginError(null); // Reset lỗi chung

    loginMutation.mutate(userData, {
      onSuccess: () => {
        console.log('Đăng nhập thành công');
      },
      onError: (error: any) => {
        if (error?.response?.data?.field && error?.response?.data?.message) {
          const { field, message } = error.response.data;

          // Gán lỗi vào trường tương ứng
          setError(field as keyof Ilogin, {
            type: 'manual',
            message,
          });
        } else {
          // Lỗi chung
          setLoginError('Đăng nhập thất bại. Vui lòng thử lại!');
        }
      },
    });
  };

  return (
    <div>
      <Header />
      <main>
        <div className="mb-4" />
        <section className="login-register container max-w-3xl">
          <h2 className="d-none">Đăng Nhập &amp; Đăng Ký</h2>
          <ul className="nav nav-tabs mb-5" id="login_register" role="tablist">
            <li className="nav-item" role="presentation">
              <a className="nav-link nav-link_underscore active" id="login-tab" data-bs-toggle="tab" href="#tab-item-login" role="tab" aria-controls="tab-item-login" aria-selected="true">Đăng Nhập</a>
            </li>
            {/* <li className="nav-item" role="presentation">
              <a className="nav-link nav-link_underscore" id="register-tab" data-bs-toggle="tab" href="#tab-item-register" role="tab" aria-controls="tab-item-register" aria-selected="false">Đăng Ký</a>
            </li> */}
          </ul>
          {/* login */}
          <div className="tab-content pt-2" id="login_register_tab_content">
            <div className="tab-pane fade show active" id="tab-item-login" role="tabpanel" aria-labelledby="login-tab">
              <div className="login-form">
                <form name="login-form" className="needs-validation" noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
                  <div className="form-floating mb-3">
                    <input  {...register('email', {
                      required: 'Email là bắt buộc',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Định dạng email không hợp lệ hoặc có dấu cách',
                      },
                    })} type="email" className="form-control form-control_gray" id="email" placeholder="Nhập email của bạn" required />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                    <label htmlFor="customerNameEmailInput1">Email *</label>
                  </div>
                  <div className="pb-3" />
                  <div className="form-floating mb-3">
                    <input type="password" {...register('password', {
                      required: 'Mật khẩu là bắt buộc',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự',
                      },
                    })} className="form-control form-control_gray" id="password" placeholder="Password *" required />
                    {errors.password && (
                      <p className="text-red-500">{errors.password.message}</p>
                    )}
                    <label htmlFor="customerPasswodInput">Mật Khẩu *</label>
                  </div>
                  <div className="d-flex align-items-center mb-3 pb-2">
                    <div className="form-check mb-0">
                      <input name="remember" className="form-check-input form-check-input_fill" type="checkbox" id="flexCheckDefault1" />
                      <label className="form-check-label text-secondary" htmlFor="flexCheckDefault1">Remember me</label>
                    </div>
                    <a href="reset_password.html" className="btn-text ms-auto">Lost password?</a>
                  </div>
                  <button className="btn btn-primary w-100 text-uppercase" type="submit">Đăng Nhập</button>
                  <div className="customer-option mt-4 text-center">
                    <span className="text-secondary">No account yet?</span>
                    <a href="#register-tab" className="btn-text js-show-register">Create Account</a>
                  </div>
                </form>
              </div>
            </div>
            {/* end_login */}
            {/* <div className="tab-pane fade" id="tab-item-register" role="tabpanel" aria-labelledby="register-tab">
              <div className="register-form">
                <form name="register-form" className="needs-validation" noValidate>
                  <div className="form-floating mb-3">
                    <input name="register_username" type="text" className="form-control form-control_gray" id="customerNameRegisterInput" placeholder="Username" required />
                    <label htmlFor="customerNameRegisterInput">Username</label>
                  </div>
                  <div className="pb-3" />
                  <div className="form-floating mb-3">
                    <input name="register_email" type="email" className="form-control form-control_gray" id="customerEmailRegisterInput" placeholder="Email address *" required />
                    <label htmlFor="customerEmailRegisterInput">Email address *</label>
                  </div>
                  <div className="pb-3" />
                  <div className="form-floating mb-3">
                    <input name="register_password" type="password" className="form-control form-control_gray" id="customerPasswodRegisterInput" placeholder="Password *" required />
                    <label htmlFor="customerPasswodRegisterInput">Password *</label>
                  </div>
                  <div className="d-flex align-items-center mb-3 pb-2">
                    <p className="m-0">Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.</p>
                  </div>
                  <button className="btn btn-primary w-100 text-uppercase" type="submit">Register</button>
                </form>
              </div>
            </div> */}
          </div>
        </section>
      </main>

    </div>
  );
}

export default Login;
