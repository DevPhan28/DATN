import { useState, useEffect } from 'react';
import { useFetchOrderAll } from '@/data/oder/useOderList';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  format,
  parseISO,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';

const DashboardNew = () => {
  const {
    listOrder,
    loading: orderLoading,
    error: orderError,
  } = useFetchOrderAll();

  const [dailyRevenueData, setDailyRevenueData] = useState([]);

  // Tính doanh thu và số lượng đơn hàng theo ngày trong tháng hiện tại
  useEffect(() => {
    const currentMonthStart = startOfMonth(new Date()); // Ngày đầu tháng
    const currentMonthEnd = endOfMonth(new Date()); // Ngày cuối tháng

    // Tạo danh sách tất cả các ngày trong tháng hiện tại
    const allDaysInMonth = eachDayOfInterval({
      start: currentMonthStart,
      end: currentMonthEnd,
    });

    let revenueByDay = {};

    // Duyệt qua danh sách đơn hàng và tính doanh thu cho từng ngày
    listOrder.forEach(order => {
      const orderDate = parseISO(order.createdAt);
      const day = format(orderDate, 'yyyy-MM-dd'); // Định dạng ngày theo `yyyy-MM-dd`

      if (
        isWithinInterval(orderDate, {
          start: currentMonthStart,
          end: currentMonthEnd,
        })
      ) {
        if (!revenueByDay[day]) {
          revenueByDay[day] = { revenue: 0, delivered: 0, canceled: 0 };
        }
        revenueByDay[day].revenue += order.totalPrice;

        if (order.status === 'delivered') {
          revenueByDay[day].delivered++;
        } else if (order.status === 'canceled') {
          revenueByDay[day].canceled++;
        }
      }
    });

    // Tạo dữ liệu biểu đồ theo từng ngày
    const chartData = allDaysInMonth.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      return {
        day: dayString,
        revenue: revenueByDay[dayString]?.revenue || 0,
        delivered: revenueByDay[dayString]?.delivered || 0,
        canceled: revenueByDay[dayString]?.canceled || 0,
      };
    });

    setDailyRevenueData(chartData);
  }, [listOrder]);

  if (orderLoading) return <p>Loading...</p>;
  if (orderError) return <p>Error: {orderError.message}</p>;

  return (
    <div className="rounded-lg bg-white p-6">
      {/* Phần biểu đồ */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickFormatter={tick => tick.slice(8)} // Hiển thị chỉ ngày (1, 2, ..., 31)
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4bc0c0"
              name="Doanh thu"
            />
            <Line
              type="monotone"
              dataKey="delivered"
              stroke="#4CAF50"
              name="Đơn hàng thành công"
            />
            <Line
              type="monotone"
              dataKey="canceled"
              stroke="#FF5733"
              name="Đơn hàng hủy"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4">
          <p className="flex gap-2 text-teal-500">Doanh thu</p>
          <p className="flex gap-2 text-green-600">Đơn hàng thành công</p>
          <p className="flex gap-2 text-red-400">Đơn hàng huỷ</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardNew;
