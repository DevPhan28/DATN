import { useState, useEffect } from 'react';
import {
  useFetchOrderAll,
  useFetchSuccessfulOrderCount,
} from '@/data/oder/useOderList';
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
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from 'date-fns';
import { EllipseBlueSolid } from '@medusajs/icons';

const DashboardOver = () => {
  const {
    listOrder,
    loading: orderLoading,
    error: orderError,
  } = useFetchOrderAll();
  const {
    data: successfulOrderData,
    isLoading: deliveredCountLoading,
    error: deliveredCountError,
  } = useFetchSuccessfulOrderCount();

  const [currentYearRevenue, setCurrentYearRevenue] = useState([]);
  const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
  const [canceledOrdersCount, setCanceledOrdersCount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  // Tính doanh thu và số lượng đơn hàng theo trạng thái trong năm hiện tại
  useEffect(() => {
    const currentYearStart = startOfYear(new Date());
    const currentYearEnd = endOfYear(new Date());

    // Lấy tất cả các tháng trong năm hiện tại
    const allMonthsInYear = eachMonthOfInterval({
      start: currentYearStart,
      end: currentYearEnd,
    });

    let revenueByMonth = {};
    let deliveredCount = 0;
    let canceledCount = 0;
    let totalCount = 0;

    // Tính doanh thu và số lượng đơn hàng cho mỗi trạng thái
    listOrder.forEach(order => {
      const orderDate = parseISO(order.createdAt);
      const month = format(orderDate, 'yyyy-MM');

      if (
        isWithinInterval(orderDate, {
          start: currentYearStart,
          end: currentYearEnd,
        })
      ) {
        totalCount++;

        if (order.status === 'delivered') {
          if (!revenueByMonth[month])
            revenueByMonth[month] = { revenue: 0, delivered: 0, canceled: 0 };
          revenueByMonth[month].revenue += order.totalPrice;
          revenueByMonth[month].delivered++;
          deliveredCount++;
        } else if (order.status === 'canceled') {
          if (!revenueByMonth[month])
            revenueByMonth[month] = { revenue: 0, delivered: 0, canceled: 0 };
          revenueByMonth[month].canceled++;
          canceledCount++;
        }
      }
    });

    setDeliveredOrdersCount(deliveredCount);
    setCanceledOrdersCount(canceledCount);
    setTotalOrdersCount(totalCount);

    // Chuyển đổi tất cả các tháng trong năm thành dạng mảng với doanh thu, số đơn hàng
    const chartData = allMonthsInYear.map(month => {
      const monthString = format(month, 'yyyy-MM');
      return {
        month: monthString,
        revenue: revenueByMonth[monthString]?.revenue || 0,
        delivered: revenueByMonth[monthString]?.delivered || 0,
        canceled: revenueByMonth[monthString]?.canceled || 0,
      };
    });

    setCurrentYearRevenue(chartData);
  }, [listOrder]);

  if (orderLoading || deliveredCountLoading) return <p>Loading...</p>;
  if (orderError || deliveredCountError)
    return <p>Error: {orderError?.message || deliveredCountError?.message}</p>;

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="flex justify-between">
        <h2 className="mb-4 text-xl font-semibold">Tổng quan</h2>
      </div>
      {/* Phần biểu đồ */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="150%">
          <LineChart data={currentYearRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
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

export default DashboardOver;
