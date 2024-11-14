import Header from '@/components/layoutAdmin/header/header';
import MyBarChart from '@/components/layoutAdmin/statistics/BarChart';
import DashboardOverview from '@/components/layoutAdmin/statistics/LineChar';
import PieChartExample from '@/components/layoutAdmin/statistics/PiaChart';
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>

        <div style={{ flex: 1 }}>
          <MyBarChart />
        </div>

        <div style={{ flex: 1}}>
          <PieChartExample />
        </div>
      </div>
    </div>
  );
}
