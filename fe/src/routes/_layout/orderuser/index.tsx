import instance from '@/api/axiosIntance';
import { useFetchOrdersByUserId } from '@/data/oder/useOderList';
import { ChevronRightMini } from '@medusajs/icons';
import { toast, usePrompt } from '@medusajs/ui';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_layout/orderuser/')({
  component: UserOrder,
});

type Order = {
  _id: string;
  status: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  products: Product[];
  totalPrice: number;
  refundReason?: string;
  items: Item[];
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'confirmed':
      return 'Chờ lấy hàng';
    case 'shipped':
      return 'Chờ giao hàng';
    case 'received':
      return 'Chờ giao hàng';
    case 'delivered':
      return 'Đã giao';
    case 'canceled':
      return 'Đã hủy';
    case 'returned':
      return 'Đã hoàn trả';
    case 'complaint':
      return 'Đang khiếu nại';
    case 'refund_in_progress':
      return 'Đang hoàn trả hàng';
    case 'refund_completed':
      return 'Hoàn trả hàng thành công';
    case 'exchange_in_progress':
      return 'Đang đổi trả hàng';
    case 'exchange_completed':
      return 'Đổi trả hàng thành công';
    default:
      return status;
  }
};

function UserOrder() {
  const [userId, setUserId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const dialog = usePrompt();

  const handleOpenComplaintModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowComplaintModal(true);
  };

  const deleteEntity = async (orderId: string) => {
    // Hiển thị hộp thoại xác nhận
    const userHasConfirmed = await dialog({
      title: 'Xác nhận hủy đơn hàng',
      description: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
    });

    // Nếu người dùng xác nhận, tiến hành hủy đơn hàng
    if (userHasConfirmed) {
      try {
        // Gọi API để hủy đơn hàng
        const response = await instance.put(`/orders/${orderId}/cancel`);
        console.log('Hủy đơn hàng thành công:', response.data);
        toast.success('Đơn hàng đã được hủy thành công.');

        // Cập nhật danh sách đơn hàng sau khi hủy
        const updatedOrders = orders.map((order: Order) =>
          order._id === orderId ? { ...order, status: 'canceled' } : order
        );
        setOrders(updatedOrders);
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error('Có lỗi xảy ra khi hủy đơn hàng, vui lòng thử lại.');
      }
    }
  };

  const handleConfirmReceived = (orderId: string) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) {
      toast.error('Không tìm thấy đơn hàng.');
      return;
    }

    // Kiểm tra trạng thái đơn hàng
    if (order.status !== 'shipped' && order.status !== 'received') {
      toast.error(
        'Chỉ có đơn hàng đang ở trạng thái "Đang giao" hoặc "Đã nhận" mới có thể xác nhận.'
      );
      return;
    }
    // Xử lý tiếp nếu trạng thái hợp lệ
    console.log('Xác nhận đơn hàng thành công:', order);

    // Gửi yêu cầu xác nhận đơn hàng đã nhận
    instance
      .put(`/orders/${orderId}/confirm-received`)
      .then(_response => {
        toast.success('Đơn hàng đã được xác nhận.');
        // Cập nhật trạng thái đơn hàng từ 'received' sang 'delivered'
        const updatedOrders = orders.map((order: Order) =>
          order._id === orderId ? { ...order, status: 'delivered' } : order
        );
        setOrders(updatedOrders);
      })
      .catch(error => {
        toast.error('Có lỗi xảy ra, vui lòng thử lại.');
        console.error('Error confirming order:', error);
      });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUserId(storedUser?.user?._id || null);
  }, []);

  const { data, isLoading, error } = useFetchOrdersByUserId(userId || '');

  useEffect(() => {
    if (data) {
      console.log('Orders data:', data); // Kiểm tra dữ liệu đơn hàng
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

  if (isLoading) {
    return <div className="mt-10 text-center text-gray-500">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="mt-10 text-center text-red-500">Lỗi: {error.message}</div>
    );
  }

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'confirmed', label: 'Chờ lấy hàng' },
    { id: 'shipped', label: 'Chờ giao hàng' },
    { id: 'delivered', label: 'Đã giao' },
    { id: 'canceled', label: 'Đã hủy' },
    { id: 'complaint', label: 'Khiếu nại' },
  ];

  const filteredOrders = orders?.filter((order: Order) => {
    // Trạng thái "Hoàn trả hàng thành công" sẽ chuyển vào tab "Đã hủy"
    if (selectedTab === 'canceled') {
      return order.status === 'canceled' || order.status === 'refund_completed'; // refund_completed chuyển vào "Đã hủy"
    }

    // Trạng thái "Đổi trả hàng thành công" sẽ chuyển vào tab "Đã giao"
    if (selectedTab === 'delivered') {
      return (
        order.status === 'delivered' || order.status === 'exchange_completed'
      ); // exchange_completed chuyển vào "Đã giao"
    }

    if (selectedTab === 'all') {
      return true;
    }

    if (selectedTab === 'pending') {
      return order.status === 'pending';
    }

    if (selectedTab === 'confirmed') {
      return order.status === 'confirmed';
    }

    if (selectedTab === 'shipped') {
      return order.status === 'shipped' || order.status === 'received';
    }

    if (selectedTab === 'delivered') {
      return order.status === 'delivered';
    }

    if (selectedTab === 'canceled') {
      return order.status === 'canceled';
    }

    if (selectedTab === 'complaint') {
      return (
        order.status === 'complaint' ||
        order.status === 'refund_in_progress' ||
        order.status === 'exchange_in_progress'
      );
    }

    return order.status === selectedTab;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const ordersToDisplay = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const storedData = JSON.parse(localStorage.getItem('user') || '{}');

  const username = storedData?.user?.username || 'Không có tên người dùng';
  const emailuser = storedData?.user?.email || 'Không có tên người dùng';

  return (
    <div className="bg-gray-50">
      <div className="bg-white">
        <div className="main-content flex h-48 w-full flex-col items-center justify-center">
          <div className="text-content">
            <div className="text-center text-4xl font-semibold">
              Đơn hàng của tôi
            </div>
            <div className="link caption1 mt-3 flex items-center justify-center gap-1">
              <div className="flex items-center justify-center">
                <a href="/">Home</a>
                <ChevronRightMini />
              </div>
              <div className="flex items-center justify-center">
                <a href="/">User</a>
                <ChevronRightMini />
              </div>
              <div className="capitalize text-gray-500">
                <a href="#">Đơn mua</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl bg-gray-50 py-10 pt-10">
        <div className="h-full w-1/4 rounded-lg bg-gray-100 p-6 shadow-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300">
              <img
                src="https://res.cloudinary.com/dlzhmxsqp/image/upload/v1716288330/e_commerce/s4nl3tlwpgafsvufcyke.jpg"
                alt="Profile"
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold">{username}</h2>
            <p className="text-gray-600">{emailuser}</p>
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

        <div className="ml-6 w-3/4">
          <div className="mb-2 flex flex-wrap justify-start border-b bg-white shadow sm:space-x-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-2 py-2 text-gray-700 sm:px-4 ${
                  selectedTab === tab.id
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
              {ordersToDisplay.map((order: Order) => {
                // const totalAmount = order.items.reduce(
                //   (total, item) => total + item.price * item.quantity,
                //   0
                // );
                return (
                  <div
                    key={order._id}
                    className="rounded-lg bg-white p-6 shadow-md"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-medium ${
                          order.status === 'canceled'
                            ? 'bg-red-200 text-red-600'
                            : order.status === 'pending'
                              ? 'bg-yellow-200 text-yellow-700'
                              : order.status === 'confirmed'
                                ? 'bg-blue-200 text-blue-700'
                                : order.status === 'shipped' ||
                                    order.status === 'received'
                                  ? 'bg-indigo-200 text-indigo-700'
                                  : order.status === 'delivered'
                                    ? 'bg-green-200 text-green-700'
                                    : order.status === 'complaint'
                                      ? 'bg-purple-500 text-white'
                                      : order.status === 'refund_in_progress' ||
                                          order.status ===
                                            'exchange_in_progress'
                                        ? 'bg-orange-200 text-orange-700'
                                        : order.status === 'refund_completed' ||
                                            order.status ===
                                              'exchange_completed'
                                          ? 'bg-teal-200 text-teal-700'
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
                            Phân loại hàng: Màu: {item.color || ''}{' '}
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
                    <div className="border-t border-dotted border-gray-200">
                      <div className="flex items-center justify-end p-4">
                        <div className="w-auto space-y-3">
                          <span className="flex items-center justify-between text-lg">
                            Giảm : <span className="ml-2">0&nbsp;₫</span>
                          </span>
                          <span className="flex items-center justify-between text-lg">
                            Tổng tiền sản phẩm :{' '}
                            <span className="ml-2">
                              {order.totalPrice.toLocaleString()}&nbsp;₫
                            </span>
                          </span>
                          <p className="flex items-center justify-between text-lg">
                            Thành tiền:{' '}
                            <span className="ml-2 text-2xl text-[#ee4d2d]">
                              {order.totalPrice.toLocaleString()}&nbsp;₫
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => deleteEntity(order._id)}
                          className="mr-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                          Hủy đơn hàng
                        </button>
                      )}
                      {order.status === 'received' && (
                        <>
                          <button
                            onClick={() => handleConfirmReceived(order._id)}
                            className="mr-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                          >
                            Đã nhận được hàng
                          </button>
                          <button
                            onClick={() => handleOpenComplaintModal(order._id)}
                            className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
                          >
                            Khiếu nại
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
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

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">
              Tình huống bạn đang gặp?
            </h2>
            <div className="flex flex-col space-y-2">
              <Link
                to={`/refund/${userId}/${selectedOrderId}`}
                className="w-full rounded bg-blue-500 p-2 text-white"
              >
                Tôi đã nhận hàng nhưng không còn nhu cầu/hàng có vấn đề (bể vỡ,
                sai mẫu, lỗi, khác mô tả...)
              </Link>
              <Link
                to={`/exchange/${userId}/${selectedOrderId}`}
                className="mt-2 w-full rounded bg-blue-500 p-2 text-white"
              >
                Tôi chưa nhận hàng/nhận thiếu hàng
              </Link>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowComplaintModal(false)}
                className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserOrder;
