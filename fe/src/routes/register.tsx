import useRegisterMutation from '@/data/auth/useRegisterMutation';
import { Button, Input } from '@medusajs/ui';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/register')({
  component: Register,
});

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Iuser>();
  const { registerMutation } = useRegisterMutation();
  const onSubmit = (data: Iuser) => {
    const userData = { ...data };
    console.log('Data to be sent:', userData);
    registerMutation.mutate(userData);
    reset();
  };

  // Lấy giá trị của password để so sánh với confirmPassword
  const password = watch('password');

  return (
    <div className="relative h-screen w-full">
      {/* Background image */}
      <img
        src="/image.png"
        alt="background-register"
        className="absolute z-0 h-full w-full object-cover"
      />

      {/* Overlay with content */}
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-10 px-6 py-6 md:flex-row md:items-end md:gap-40 md:pl-20 md:pr-10">
        {/* Left section with text */}
        <div className="w-full space-y-5 text-center text-ui-bg-base md:mt-auto md:w-1/2 md:text-left">
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
            src="/blueberry-logo.jpg"
            alt="blueberry-logo"
            className="mb-6 max-h-24 w-24 object-cover md:mb-8 md:w-32"
          />

          {/* Welcome message */}
          <div className="mb-8 space-y-1 text-center">
            <p className="txt-compact-large text-ui-fg-subtle">
              Welcome to Fashion Zone
            </p>
            <p className="text-header-web-2 font-semibold text-ui-fg-base">
              Create an account
            </p>
          </div>

          {/* Form section */}
          <form
            onSubmit={e => void handleSubmit(onSubmit)(e)}
            className="w-full space-y-6 md:space-y-10"
          >
            {/* Inputs */}
            <div className="space-y-4">
              {/* User input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="user">User</label>
                <Input
                  id="user"
                  aria-label="User"
                  {...register('username', {
                    required: 'Username is required',
                    validate: {
                      noWhitespace: value =>
                        !/\s/.test(value) ||
                        'Username should not contain spaces',
                    },
                  })}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>

              {/* Email input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  aria-label="Email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format or contains spaces',
                    },
                  })}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  aria-label="Password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Input
                  id="confirmPassword"
                  aria-label="Confirm Password"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirm Password is required',
                    validate: value =>
                      value === password || 'Passwords do not match',
                  })}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Signup button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Signup
            </Button>
          </form>

          {/* Login link */}
          <p className="txt-compact-large mt-6 text-ui-fg-subtle">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>{' '}
            here!
          </p>
        </div>
      </div>
    </div>
  );
}
