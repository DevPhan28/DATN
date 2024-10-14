import { Button, Input } from '@medusajs/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  component: Register,
});

function Register() {
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
          <form className="w-full space-y-6 md:space-y-10">
            {/* Inputs */}
            <div className="space-y-4">
              {/* User input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="user">User</label>
                <Input
                  id="user"
                  placeholder="Enter your username"
                  aria-label="User"
                />
              </div>

              {/* Email input */}
              <div className="txt-compact-medium-plus space-y-2 text-ui-fg-subtle">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  aria-label="Email"
                />
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  aria-label="Password"
                />
              </div>

              {/* Confirm password input */}
              <div className="space-y-2">
                <label htmlFor="confirm-password">Confirm Password</label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  aria-label="Confirm Password"
                />
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
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>{' '}
            here!
          </p>
        </div>
      </div>
    </div>
  );
}
