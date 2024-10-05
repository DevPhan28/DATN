import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_layout')({
  component: () => (
    <div>
      <div className="w-full bg-[#E5E7EB]">
        <Outlet />
      </div>
    </div>
  ),
});

