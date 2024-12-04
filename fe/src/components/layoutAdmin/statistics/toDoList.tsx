import { useFetchOrders } from '@/data/oder/useOderList';
import { Link } from '@tanstack/react-router';

const translateOrderStatus = status => {
  const statusTranslations = {
    pendingPayment: 'Đang chờ thanh toán',
    pending: 'Đang chờ xử lý',
    confirmed: 'Đã xác nhận',
    shipped: 'Đang giao hàng',
    received: 'Đã nhận hàng',
    delivered: 'Đã giao hàng',
    canceled: 'Đơn bị hủy',
    complaint: 'Khiếu nại',
    refund_in_progress: 'Đang hoàn trả hàng',
    refund_completed: 'Hoàn trả hàng thành công',
    exchange_in_progress: 'Đang đổi trả hàng',
    exchange_completed: 'Đổi trả hàng thành công',
  };

  return statusTranslations[status] || status;
};

const ToDoList = () => {
  const { data, isLoading, error } = useFetchOrders({}); // Adjust parameters if needed

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading orders: {error.message}</p>;

  // Define all possible statuses with default count of 0
  const defaultStatusCounts = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    received: 0,
    delivered: 0,
    canceled: 0,
    complaint: 0,
    refund_in_progress: 0,
    refund_completed: 0,
    exchange_in_progress: 0,
    exchange_completed: 0,
  };

  const statusCounts = { ...defaultStatusCounts, ...data?.statusCounts };

  const orders = data?.orders || [];

  return (
    <div className="m-6 rounded-lg bg-white p-6">
      <h2 className="mb-8 text-xl font-semibold">Danh sách cần làm</h2>
      <div className="grid grid-cols-4 gap-4">
        {Object.keys(statusCounts).map(status => (
          <div key={status} className="text-center">
            <Link to={`/dashboard/order?page=1&limit=10&status=${status}`}>
              <div className="text-3xl font-bold text-blue-500">
                {statusCounts[status]}
              </div>
              <p className="text-sm text-gray-600">
                {translateOrderStatus(status)}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoList;
