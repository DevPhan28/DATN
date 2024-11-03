import instance from '@/api/axiosIntance';
import { useFetchOrdersByUserId } from '@/data/oder/useOderList';
import { toast } from '@medusajs/ui';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_layout/orderuser')({
  component: UserOder,
});

const getStatusLabel = status => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'confirmed':
      return 'Chờ lấy hàng';
    case 'shipped':
      return 'Chờ giao hàng';
    case 'delivered':
      return 'Chờ giao hàng';
    case 'received':
      return 'Đã giao';
    case 'canceled':
      return 'Đã hủy';
    default:
      return status;
  }
};

function UserOder() {
  const [userId, setUserId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserId(storedUser?.user?._id);
  }, []);

  const { data, isLoading, error } = useFetchOrdersByUserId(userId);

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  if (!userId) {
    return (
      <div className="mt-10 text-center text-gray-500">
        Vui lòng đăng nhập để xem đơn hàng của bạn.
      </div>
    );
  }

  if (isLoading)
    return <div className="mt-10 text-center text-gray-500">Đang tải...</div>;
  if (error)
    return (
      <div className="mt-10 text-center text-red-500">Lỗi: {error.message}</div>
    );

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'confirmed', label: 'Chờ lấy hàng' },
    { id: 'shipped', label: 'Chờ giao hàng' },
    { id: 'received', label: 'Đã giao' },
    { id: 'canceled', label: 'Đã hủy' },
  ];

  const filteredOrders = orders?.filter(
    order =>
      selectedTab === 'all' ||
      (selectedTab === 'shipped' &&
        (order.status === 'shipped' || order.status === 'delivered')) ||
      (selectedTab === 'received' && order.status === 'received') ||
      order.status === selectedTab
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const ordersToDisplay = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = newPage => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleConfirmReceived = async orderId => {
    try {
      await instance.put(`/orders/${orderId}/confirm-received`);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'received' } : order
        )
      );
      toast.success('Cảm ơn bạn đã xác nhận đã nhận hàng!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xác nhận nhận hàng.');
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl p-4">
      {/* Sidebar: User Profile and Navigation */}
      <div className="w-1/4 rounded-lg bg-gray-100 p-6 shadow-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300">
            <img
              src="path/to/profile-image.png"
              alt="Profile"
              className="rounded-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold">Nam Trần</h2>
          <p className="text-gray-600">oaoplapll22w2@gmail.com</p>
          <div className="mt-4">
            <a
              href="/my-account"
              className="block text-blue-600 hover:underline"
            >
              Tài khoản của tôi
            </a>
            <a href="/orders" className="block text-red-600 hover:underline">
              Đơn mua
            </a>
          </div>
        </div>
      </div>

      {/* Content Area: Order Tabs and Order Details */}
      <div className="ml-6 w-3/4">
        {/* Tabs Section */}
        <div className="mb-4 flex justify-start space-x-6 border-b pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 text-gray-700 ${
                selectedTab === tab.id
                  ? 'border-b-2 border-red-500 text-red-600'
                  : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List or Empty State */}
        {ordersToDisplay.length > 0 ? (
          <div className="space-y-4">
            {ordersToDisplay.map(order => (
              <div
                key={order._id}
                className="rounded-lg bg-white p-6 shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-4 py-1 text-sm font-medium ${
                      order.status === 'canceled'
                        ? 'bg-red-100 text-red-600'
                        : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-600'
                            : order.status === 'shipped' ||
                                order.status === 'delivered'
                              ? 'bg-indigo-100 text-indigo-600'
                              : order.status === 'received'
                                ? 'bg-green-100 text-green-600'
                                : ''
                    }`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Mã đơn hàng: {order.orderNumber}
                  </span>
                </div>

                {order.items.map(item => (
                  <div
                    key={item.productId}
                    className="mb-4 flex items-center space-x-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <p className="text-xl font-semibold uppercase text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phân loại hàng: {item.color ? `Màu: ${item.color}` : ''}
                        {item.size ? `, Size: ${item.size}` : ''}
                      </p>
                      <p className="font-medium text-gray-800">
                        x{item.quantity}
                      </p>
                    </div>
                    <span className="text-base text-[#ee4d2d]">
                      {item.price} đ
                    </span>
                  </div>
                ))}

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  {order.status === 'delivered' &&
                    selectedTab === 'shipped' && (
                      <button
                        onClick={() => handleConfirmReceived(order._id)}
                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                      >
                        Đã nhận được hàng
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-60 flex-col items-center justify-center">
            <img
              src="./no-oder.png"
              className="h-24 w-24 object-cover"
              alt="No orders"
            />
            <span className="mt-4 text-gray-500">Chưa có đơn hàng</span>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="rounded-full bg-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-300"
            disabled={currentPage === 1}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`rounded-full px-4 py-2 ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="rounded-full bg-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserOder;
