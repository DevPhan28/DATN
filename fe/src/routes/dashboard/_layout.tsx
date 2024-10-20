import Sidebar from '@/components/layoutAdmin/sidebar';
import { toast } from '@medusajs/ui';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_layout')({
  beforeLoad: () => {
    let user = null;
    if (localStorage.getItem('user')) {
      user = JSON.parse(localStorage.getItem('user') as string);
    } else {
      // Hiển thị thông báo lỗi và chuyển hướng
      toast.error('Bạn cần đăng nhập để truy cập vào dashboard.');
      throw redirect({
        to: '/',
        search: {
          redirect: Route.path,
        },
      });
    }

    // Kiểm tra quyền hạn của người dùng
    if (user.user.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập vào dashboard');
      throw redirect({
        to: '/',
      });
    } else {
      toast.success('Đăng nhập thành công');
    }
  },
  component: () => (
    <div className="flex min-h-screen min-w-full flex-row">
      <Sidebar />
      <div className="w-full overflow-hidden bg-ui-bg-subtle pb-6">
        <Outlet />
      </div>
    </div>
  ),
});
