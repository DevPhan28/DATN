import Footer from '@/components/footer';
import Header from '@/components/header';
import { Toaster } from '@medusajs/ui';
import { createFileRoute, Outlet } from '@tanstack/react-router';
export const Route = createFileRoute('/_layout')({
  component: () => (
    <div>
      <Toaster position="top-right" />
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),
});
