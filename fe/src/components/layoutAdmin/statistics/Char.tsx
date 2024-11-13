import { useState } from 'react';
import { useFetchOrderAll, useFetchSuccessfulOrderCount } from '@/data/oder/useOderList';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO, isAfter, isBefore, isEqual, addDays, differenceInDays } from 'date-fns';

const DashboardOverview = () => {
  const { listOrder, loading: orderLoading, error: orderError } = useFetchOrderAll();
  const { data: successfulOrderData, isLoading: deliveredCountLoading, error: deliveredCountError } = useFetchSuccessfulOrderCount();

  const totalDeliveredAmount = successfulOrderData?.totalDeliveredAmount || 0;
  const deliveredOrderCount = successfulOrderData?.successfulOrders || 0;

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const generateDateRange = (start: Date, end: Date) => {
    const days = differenceInDays(end, start);
    return Array.from({ length: days + 1 }, (_, i) => format(addDays(start, i), 'yyyy-MM-dd'));
  };

  const revenueByDay = listOrder.reduce((acc: Record<string, number>, order) => {
    if (order.status === 'delivered') {
      const date = format(new Date(order.createdAt), 'yyyy-MM-dd');

      const isWithinRange =
        (!startDate || isAfter(parseISO(date), parseISO(startDate)) || isEqual(parseISO(date), parseISO(startDate))) &&
        (!endDate || isBefore(parseISO(date), parseISO(endDate)) || isEqual(parseISO(date), parseISO(endDate)));

      if (isWithinRange) {
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += order.totalPrice;
      }
    }
    return acc;
  }, {});

  const chartStartDate = startDate ? parseISO(startDate) : new Date();
  const chartEndDate = endDate ? parseISO(endDate) : new Date();
  const dateRange = generateDateRange(chartStartDate, chartEndDate);

  const chartData = dateRange.map(date => ({
    date,
    revenue: revenueByDay[date] || 0,
  }));

  if (orderLoading || deliveredCountLoading) return <p>Loading...</p>;
  if (orderError || deliveredCountError) return <p>Error: {orderError?.message || deliveredCountError?.message}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Tổng quan</h2>

      {/* Phần chọn ngày */}
      <div className="mb-6 flex items-center gap-4">
        <div>
          <label className="block text-gray-700">Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (endDate && isBefore(parseISO(e.target.value), parseISO(endDate))) {
                setEndDate('');
              }
            }}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-gray-700">Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined} // Giới hạn ngày tối thiểu là "Từ ngày" đã chọn
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Phần tổng quan doanh thu và đơn hàng */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Tổng doanh thu</h3>
          <p className="text-2xl font-bold">₫ {totalDeliveredAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Tổng giá trị đơn hàng đã giao</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold">Đơn hàng đã giao</h3>
          <p className="text-2xl font-bold">{deliveredOrderCount}</p>
          <p className="text-sm text-gray-500">Số lượng đơn hàng đã giao thành công</p>
        </div>
      </div>

      {/* Phần biểu đồ */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#4bc0c0" name="Doanh thu" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardOverview;
