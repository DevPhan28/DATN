import Banertime from '@/components/Banertime';
import ChatBot from '@/components/ChatBot';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Toaster } from '@medusajs/ui';
import { createFileRoute, Outlet } from '@tanstack/react-router';
export const Route = createFileRoute('/_layout')({
  component: () => (
    <div>
      <Toaster position="top-right" className="mt-7" />

      <div>
        <Banertime />
        <Header />
        <Outlet />
      </div>
      <div>
        <ChatBot />
      </div>
      <Footer />
    </div>
  ),
});
