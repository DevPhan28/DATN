import instance from '@/api/axiosIntance';
import { useFetchOrdersByUserId } from '@/data/oder/useOderList';
import { ChevronRightMini } from '@medusajs/icons';
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

  const handleCancelOrder = async orderId => {
    try {
      await instance.put(`/orders/${orderId}/cancel`);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'canceled' } : order
        )
      );
      toast.success('Đơn hàng của bạn đã được hủy thành công.');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi hủy đơn hàng.');
    }
  };

  const storedData = JSON.parse(localStorage.getItem('user'));
  const username = storedData?.user?.username || 'Không có tên người dùng';
  const emailuser = storedData?.user?.email || 'Không có tên người dùng';

  return (
    <div className='bg-gray-50'>
      <div className='bg-white'>
        <div className="main-content w-full h-48 flex flex-col items-center justify-center ">
          <div className="text-content">
            <div className="text-4xl font-semibold text-center">
              Đơn hàng của tôi
            </div>
            <div className="link flex items-center justify-center gap-1 caption1 mt-3">
              <div className="flex items-center justify-center">
                <a href="/">Home</a>
                <ChevronRightMini />
              </div>
              <div className="flex items-center justify-center">
                <a href="/">User</a>
                <ChevronRightMini />
              </div>
              <div className="text-gray-500 capitalize">
                <a href="#">Đơn mua</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl bg-gray-50 pt-10 py-10">
        <div className="w-1/4 h-full rounded-lg bg-gray-100 p-6 shadow-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300">
              <img
                src="https://res.cloudinary.com/dlzhmxsqp/image/upload/v1716288330/e_commerce/s4nl3tlwpgafsvufcyke.jpg"
                alt="Profile"
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold">{username}</h2>
            <p className="text-gray-600 ">{emailuser}</p>
            <div className="mt-4 ">
              <a href="/my-account" className="block text-blue-600 hover:underline">
                Tài khoản của tôi
              </a>
              <a href="/orders" className="block text-red-600 hover:underline">
                Đơn mua
              </a>
            </div>
          </div>
        </div>

        <div className="ml-6 w-3/4">
          <div className="mb-2 flex flex-wrap justify-start  sm:space-x-6 border-b shadow bg-white">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-2 sm:px-4 py-2 text-gray-700 ${selectedTab === tab.id
                  ? 'border-b-2 border-red-500 text-red-600'
                  : ''
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {ordersToDisplay.length > 0 ? (
            <div className="space-y-4">
              {ordersToDisplay.map(order => {
                const totalAmount = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
                return (
                  <div key={order._id} className="rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`rounded-full px-4 py-1 text-sm font-medium ${order.status === 'canceled'
                        ? 'bg-red-100 text-red-600'
                        : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-600'
                            : order.status === 'shipped' || order.status === 'delivered'
                              ? 'bg-indigo-100 text-indigo-600'
                              : order.status === 'received'
                                ? 'bg-green-100 text-green-600'
                                : ''
                        }`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-sm text-gray-500">Mã đơn hàng: {order.orderNumber}</span>
                    </div>
                    {order.items.map(item => (
                      <div key={item.productId} className="mb-4 flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover shadow-sm" />
                        <div className="flex-1">
                          <p className="text-xl font-semibold uppercase text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Phân loại hàng: {item.color ? `Màu: ${item.color}` : ''}{item.size ? `, Size: ${item.size}` : ''}
                          </p>
                          <p className="font-medium text-gray-800">x{item.quantity}</p>
                        </div>
                        <span className="text-base text-[#ee4d2d]">{item.price} đ</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 border-dotted">
                      <div className="p-4 flex items-center justify-end">
                        <div className="w-auto space-y-3">
                          <span className="flex items-center justify-between text-lg">
                            Giảm : <span className="ml-2">0&nbsp;₫</span>
                          </span>
                          <span className="flex items-center justify-between text-lg">
                            Tổng tiền sản phẩm : <span className="ml-2">{totalAmount.toLocaleString()}&nbsp;₫</span>
                          </span>
                          <p className="flex items-center justify-between text-lg">
                            Thành tiền: <span className="text-2xl text-[#ee4d2d] ml-2">{totalAmount.toLocaleString()}&nbsp;₫</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end ">
                      {order.status === 'pending' && (
                        <button onClick={() => handleCancelOrder(order._id)} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                          Hủy đơn hàng
                        </button>
                      )}
                      {order.status === 'delivered' && selectedTab === 'shipped' && (
                        <button onClick={() => handleConfirmReceived(order._id)} className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                          Đã nhận được hàng
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-60 flex-col items-center justify-center">
              <img src="./no-oder.png" className="h-24 w-24 object-cover" alt="No orders" />
              <span className="mt-4 text-gray-500">Chưa có đơn hàng</span>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center space-x-2">
            <button onClick={() => handlePageChange(currentPage - 1)} className="rounded-full bg-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-300" disabled={currentPage === 1}>
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={`rounded-full px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {index + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} className="rounded-full bg-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-300" disabled={currentPage === totalPages}>
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserOder;
