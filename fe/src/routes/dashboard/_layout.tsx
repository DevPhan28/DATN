import Sidebar from '@/components/layoutAdmin/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_layout')({
  component: () => (
    <div className="flex min-h-screen min-w-full flex-row">
      <Sidebar />
      <div className="w-full overflow-hidden bg-ui-bg-subtle pb-6">
        <Outlet />
      </div>
    </div>
  ),
});

