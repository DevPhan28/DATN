import instance from '@/api/axiosIntance';
import CurrencyVND from '@/components/config/vnd';
import { Table, toast } from '@medusajs/ui';
import { ArchiveBox, TagSolid, Users } from '@medusajs/icons';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute(
  '/dashboard/_layout/detailorder/$id/detailorder'
)({
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = useParams({
    from: '/dashboard/_layout/detailorder/$id/detailorder',
  });
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRevenueVisible, setRevenueVisible] = useState(false);

  const toggleRevenueVisibility = () => {
    setRevenueVisible(!isRevenueVisible);
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/orders/${id}/admin`);
        setOrderDetail(response.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        toast.error('Không thể tải đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold text-gray-600">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold text-gray-600">
          Không tìm thấy đơn hàng.
        </div>
      </div>
    );
  }

  const {
    orderNumber,
    customerInfo,
    items,
    totalPrice,
    status,
    paymentMethod,
    paymentStatus,
    note,
    createdAt,
    receivedAt,
    shippingMessageDisplay,
  } = orderDetail;

  const formatDate = date => new Date(date).toLocaleString();

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <div className="mt-2 border-gray-100">
          <div className="mt-2 overflow-x-auto">
            <div className="rounded-lg">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">
                  <div>
                    <p
                      className={`font-semibold ${status === 'pending' ? 'text-yellow-400' : 'text-green-600'}`}
                    >
                      {status}
                    </p>
                  </div>
                </h1>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="mb-4">
                  <h2 className="mb-2 flex items-center space-x-2 text-lg font-semibold">
                    <ArchiveBox /> <span>Mã đơn hàng</span>
                  </h2>
                  <p>{orderNumber}</p>
                </div>
                <div className="mb-4">
                  <h2 className="mb-2 flex items-center space-x-2 text-lg font-semibold">
                    <TagSolid /> <p>Địa chỉ nhận hàng</p>
                  </h2>
                  <p>Số điện thoại: (+84) {customerInfo.phone}</p>
                  <p>
                    Địa chỉ: {customerInfo.address}, {customerInfo.wards},{' '}
                    {customerInfo.districts}, {customerInfo.city}
                  </p>
                </div>
                <div className="mb-4">
                  <h2 className="mb-2 flex items-center space-x-2 text-lg font-semibold">
                    <Users /> <p>Thông tin vận chuyển</p>
                  </h2>
                  <p>
                    Kiện hàng :
                    <span className="rounded-lg bg-green-100 px-2 py-1 text-green-500">
                      {orderNumber}
                    </span>
                  </p>
                  <p className="mt-2">Họ tên: {customerInfo.name}</p>
                  <p className="mt-2">Email: {customerInfo.email}</p>
                </div>
                <div className="mb-4">
                  <h2 className="mb-2 text-lg font-semibold">Sản phẩm</h2>
                  <div className="flex items-center">
                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="mr-2 h-12 w-12 object-cover"
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-2 text-center text-sm text-gray-500"
                        >
                          Không có sản phẩm nào trong đơn hàng.
                        </td>
                      </tr>
                    )}

                    <div>
                      <p
                        className={`font-semibold ${status === 'pending' ? 'text-yellow-400' : 'text-green-600'}`}
                      >
                        {status}
                      </p>
                      <p className="text-gray-500">{formatDate(createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Đơn Giá
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Số lượng
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={item._id} className="border-b">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="flex items-center p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="mr-2 h-12 w-12 object-cover"
                        />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-sm text-gray-500">
                            Phân loại: {item.color} / {item.size}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {item.price.toLocaleString()} ₫
                      </td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">
                        {(item.price * item.quantity).toLocaleString()} ₫
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-2 text-center text-sm text-gray-500"
                    >
                      Không có sản phẩm nào trong đơn hàng.
                    </td>
                  </tr>
                )}

                <tr>
                  <td colSpan={5} className="relative">
                    <div className="flex items-center">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <button
                        onClick={toggleRevenueVisibility}
                        className="mx-4 whitespace-nowrap pr-6 text-right text-gray-500"
                      >
                        {isRevenueVisible
                          ? 'Ẩn chi tiết doanh thu'
                          : 'Xem chi tiết doanh thu'}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Dòng hiển thị doanh thu */}
                {isRevenueVisible && (
                  <>
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-gray-500">
                        Giá sản phẩm
                      </td>
                      <td className="px-4 py-2">
                        {items.map((item, index) => (
                          <td key={item._id} className="">
                            <CurrencyVND amount={item.price * item.quantity} />
                          </td>
                        ))}
                      </td>

                      <td></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-4 py-2 font-semibold">
                        Tổng phí vận chuyển
                      </td>

                      <td></td>
                      <td className="px-4 py-2"></td>
                    </tr>

                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-gray-500">
                        Phí vận chuyển
                      </td>
                      <td className="px-4 py-2">
                        {shippingMessageDisplay?.props?.amount ? (
                          <CurrencyVND
                            amount={shippingMessageDisplay.props.amount}
                          />
                        ) : (
                          <span className="text-gray-600">
                            Miễn phí vận chuyển
                          </span>
                        )}
                      </td>
                      <td></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-4 py-2 font-semibold">
                        Giảm giá
                      </td>

                      <td className="px-4 py-2">
                        <CurrencyVND amount={orderDetail.discount} />
                      </td>
                    </tr>

                    {/* <tr>
                      <td colSpan={4} className="px-4 py-2 font-semibold">
                        Fees & Charges
                      </td>
                      <td className="px-4 py-2">-₫6.585</td>
                      <td></td>
                      <td className="px-4 py-2"></td>
                    </tr> */}
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-4 py-2 font-semibold">
                        Doanh Thu Đơn Hàng
                      </td>
                      <td className="px-4 py-2 text-lg text-red-500">
                        <CurrencyVND amount={totalPrice} />
                      </td>
                      <td></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-4 py-2 font-semibold">
                        Phương thức thanh toán
                      </td>
                      <td className="px-4 py-2 text-lg">{paymentMethod}</td>
                      <td></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
