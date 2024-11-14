import { useFetchOrders } from '@/data/oder/useOderList';
import { Link } from '@tanstack/react-router';

const translateOrderStatus = status => {
  const statusTranslations = {
    pending: 'Đang chờ xử lý',
    confirmed: 'Đã xác nhận',
    shipped: 'Đang giao hàng',
    received: 'Đã nhận hàng',
    delivered: 'Đã giao hàng',
    canceled: 'Đã hủy',
    refund: 'Hoàn tiền',
    exchange: 'Đổi hàng',
    return_completed: 'Hoàn trả hoàn tất',
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
    refund: 0,
    exchange: 0,
    return_completed: 0,
  };

  const statusCounts = { ...defaultStatusCounts, ...data?.statusCounts };

  const orders = data?.orders || [];

  return (
    <div className="m-6 rounded-lg bg-white p-6">
      <h2 className="mb-8 text-xl font-semibold">Danh sách cần làm</h2>
      <div className="grid grid-cols-4 gap-4">
        {Object.keys(statusCounts).map(status => (
          <div key={status} className="text-center">
            <Link to="/dashboard/order">
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
