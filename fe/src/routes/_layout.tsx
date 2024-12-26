import Banertime from '@/components/Banertime';
import CardProduct1 from '@/components/CardProduct1';
import ChatBot from '@/components/ChatBot';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import HandleAddToCart from './_layout/shop';
export const Route = createFileRoute('/_layout')({
  component: () => (
    <div>
      <div>
        <Banertime />
        <Header />
        <Outlet />
      </div>
      <div>
        <ChatBot />
      </div>
      <Footer />
      {/* <HandleAddToCart /> */}
      {/* <div>
        <CardProduct1 />
      </div> */}
    </div>

  ),
});
