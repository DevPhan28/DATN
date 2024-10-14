import useLoginMutation from '@/data/auth/useLoginMutation';
import { Button, Input } from '@medusajs/ui';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Iuser>();
  const { loginMutation } = useLoginMutation();
  const onSubmit = (data: Iuser) => {
    const userData = { ...data };
    loginMutation.mutate(userData);
    reset();
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
                Login to your account
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {/* Email input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  {...register('email', { required: true })}
                  placeholder="Enter your email"
                  aria-label="Email"
                />
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  {...register('password', { required: true })}
                  placeholder="Enter your password"
                  type="password"
                  aria-label="Password"
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Login
            </Button>
          </form>

          {/* Forgot password */}
          <p className="txt-compact-large mt-6 text-ui-fg-subtle">
            {' '}
            <a href="#" className="text-blue-600 hover:underline">
              Forgot your password?
            </a>{' '}
          </p>
        </div>
      </div>
    </div>
  );
}
