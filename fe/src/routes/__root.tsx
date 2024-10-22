import { Toaster } from '@medusajs/ui';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster position="top-right" className="mt-7" />
      <Outlet />
      <Suspense></Suspense>
    </>
  ),
});
