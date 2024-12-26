import Footer from '@/components/footer';
import Header from '@/components/header';
import useLoginMutation from '@/data/auth/useLoginMutation';
import useRegisterMutation from '@/data/auth/useRegisterMutation';
import { Button, Input } from '@medusajs/ui';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/register')({
  component: Register,
});

function Register() {
  // const [loginError, setLoginError] = useState<string | null>(null);

  // const {
  //   register,
  //   handleSubmit,
  //   setError, // Hàm gán lỗi vào trường cụ thể
  //   formState: { errors },
  // } = useForm<Ilogin>();

  // const { loginMutation } = useLoginMutation();

  // const onSubmit = (data: Ilogin) => {
  //   const userData = { ...data };
  //   setLoginError(null); // Reset lỗi chung

  //   loginMutation.mutate(userData, {
  //     onSuccess: () => {
  //       console.log('Đăng nhập thành công');
  //     },
  //     onError: (error: any) => {
  //       if (error?.response?.data?.field && error?.response?.data?.message) {
  //         const { field, message } = error.response.data;

  //         // Gán lỗi vào trường tương ứng
  //         setError(field as keyof Ilogin, {
  //           type: 'manual',
  //           message,
  //         });
  //       } else {
  //         // Lỗi chung
  //         setLoginError('Đăng nhập thất bại. Vui lòng thử lại!');
  //       }
  //     },
  //   });
  // };
  // đăng ký
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
    <div>
      <Header />
      <main>
        <div className="mb-4" />
        <section className="login-register container max-w-3xl">
          <ul className="nav nav-tabs mb-5" id="login_register" role="tablist">
            <li className="nav-item" role="presentation">
              <a className="nav-link nav-link_underscore active" id="register-tab" data-bs-toggle="tab" href="#tab-item-register" role="tab" aria-controls="tab-item-register" aria-selected="false">Đăng Ký</a>
            </li>
          </ul>
          <div className="tab-content pt-2" id="login_register_tab_content">

            {/* end_login */}
            <div className="" id="" role="tabpanel" aria-labelledby="register-tab">
              <div className="">
                <form name="register-form" className="needs-validation" onSubmit={e => void handleSubmit(onSubmit)(e)} noValidate>
                  <div className="form-floating mb-3">
                    <input {...register('username', {
                      required: 'Tên người dùng là bắt buộc',
                      validate: {
                        noWhitespace: value =>
                          !/\s/.test(value) ||
                          'Tên người dùng không được chứa khoảng trắng',
                        noAccent: value =>
                          usernameNoAccentRegex.test(value) ||
                          'Tên người dùng không được chứa dấu',
                      },
                    })} type="text" className="form-control form-control_gray" id="user" placeholder="Nhập tên người dùng của bạn" required />
                    {errors.username && (
                      <p className="text-red-500">{errors.username.message}</p>
                    )}
                    <label htmlFor="customerNameRegisterInput">Họ & Tên</label>
                  </div>
                  <div className="pb-3" />
                  <div className="form-floating mb-3">
                    <input {...register('email', {
                      required: 'Email là bắt buộc',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message:
                          'Định dạng email không hợp lệ hoặc chứa khoảng trắng',
                      },
                    })} type="email" className="form-control form-control_gray" id="email" placeholder="Nhập email của bạn" required />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                    <label htmlFor="customerEmailRegisterInput">Email *</label>
                  </div>
                  {/* <div className="form-floating mb-3">
                    <input {...register('phone', {
                      required: 'Số điện thoại là bắt buộc',
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: 'Số điện thoại không hợp lệ!',
                      },
                    })} type="email" className="form-control form-control_gray" id="phone" placeholder="Nhập SĐT của bạn" required />
                    {errors.phone && (
                      <p className="text-red-500">{errors.phone.message}</p>
                    )}
                    <label htmlFor="customerEmailRegisterInput">SĐT *</label>
                  </div> */}
                  <div className="pb-3" />
                  <div className="form-floating mb-3">
                    <input {...register('password', {
                      required: 'Mật khẩu là bắt buộc',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự',
                      },
                    })} type="password" className="form-control form-control_gray" id="password" placeholder="Nhập mật khẩu của bạn *" required />
                    {errors.password && (
                      <p className="text-red-500">{errors.password.message}</p>
                    )}
                    <label htmlFor="customerPasswodRegisterInput">Mật khẩu *</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input {...register('confirmPassword', {
                      required: 'Xác nhận mật khẩu là bắt buộc',
                      validate: value =>
                        value === password || 'Mật khẩu xác nhận không khớp',
                    })} type="password" className="form-control form-control_gray" id="confirmPassword" placeholder="Xác nhận mật khẩu của bạn" required />
                    {errors.confirmPassword && (
                      <p className="text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                    <label htmlFor="customerPasswodRegisterInput">Xác Nhận Mật khẩu *</label>
                  </div>
                  <div className="d-flex align-items-center mb-3 pb-2">
                    <p className="m-0">Dữ liệu cá nhân của bạn sẽ được sử dụng để hỗ trợ trải nghiệm của bạn trên toàn bộ trang web này, để quản lý quyền truy cập vào tài khoản của bạn và cho các mục đích khác được mô tả trong chính sách bảo mật của chúng tôi.</p>
                  </div>
                  <button className="btn btn-primary w-100 text-uppercase" type="submit">Đăng Ký</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Register;
