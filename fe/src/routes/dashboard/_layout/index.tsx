import Header from '@/components/layoutAdmin/header/header';
import DashboardOverview from '@/components/layoutAdmin/statistics/Char';
import ToDoList from '@/components/layoutAdmin/statistics/toDoList';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_layout/')({
  component: ThongKe,
});

function ThongKe() {
  return (
    <div>
      <Header title="Dashboard" pathname="/" />
      <ToDoList />
      <DashboardOverview />
    </div>
  );
}
