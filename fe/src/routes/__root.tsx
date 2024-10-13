import { Toaster } from '@medusajs/ui';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';


export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <Suspense>
      </Suspense>
    </>
  ),
});
