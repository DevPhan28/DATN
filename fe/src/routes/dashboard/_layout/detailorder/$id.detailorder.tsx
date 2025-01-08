import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';
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
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Chi tiết theo dõi đơn hàng */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-lg font-bold mb-4">Chi tiết theo dõi đơn hàng</h2>
        <div className="flex items-center justify-between">
          {['Đã Đặt Hàng', 'Xác nhận', 'Đang giao hàng', 'Giao hàng', 'Đã nhận hàng'].map((status, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                ✓
              </div>
              <p className="text-sm mt-2 text-center">{status}</p>
              <p className="text-xs text-gray-500">02/12/2024 22:46:41</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bảng theo dõi đơn hàng */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-lg font-bold mb-4">Theo dõi đơn hàng</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Thông tin</th>
              <th className="py-2">Ngày giờ</th>
              <th className="py-2">Tin nhắn</th>
              <th className="py-2">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {[
              { info: 'Đặt hàng thành công', time: '2024-12-02 22:44:41', message: 'Đơn hàng đặt thành công', detail: 'Đơn hàng đã được đặt' },
              { info: 'Xác nhận đơn hàng', time: '2024-12-02 22:46:55', message: 'Đơn hàng đang được chuẩn bị', detail: 'Shop đang chuẩn bị đơn hàng' },
              { info: 'Đang giao hàng', time: '2024-12-02 22:56:05', message: 'Đơn hàng đang giao', detail: 'Đơn hàng sẽ sớm được giao, vui lòng chú ý điện thoại' },
              { info: 'Giao hàng thành công', time: '2024-12-02 22:56:23', message: 'Đơn hàng giao thành công', detail: 'Người nhận: nguyễn danh quân' },
              { info: 'Đã nhận hàng', time: '2024-12-02 22:57:19', message: 'Đơn hàng thành công', detail: '' },
            ].map((row, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{row.info}</td>
                <td className="py-2">{row.time}</td>
                <td className="py-2">{row.message}</td>
                <td className="py-2">{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sản phẩm đơn hàng */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-5">
        <h2 className="text-lg font-bold mb-4">Sản phẩm đơn hàng</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Sản phẩm</th>
              <th className="py-2">Phân loại</th>
              <th className="py-2">Số lượng</th>
              <th className="py-2">Giá</th>
              <th className="py-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className="py-2 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md" />
                    {item.name}
                  </td>
                  <td className="py-2">Phân loại: {item.color} / {item.size}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2"> {item.price.toLocaleString()} ₫</td>
                  <td className="py-2">{(item.price * item.quantity).toLocaleString()} ₫</td>
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
          </tbody>
        </table>
        <div className="text-right mt-4 font-bold">{items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} ₫</div>
      </div>

      {/* Thông tin thanh toán và Địa chỉ đặt hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Thông tin thanh toán</h2>
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2">Giá tiền</td>
                <td className="py-2 text-right">{items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} ₫</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Phí vận chuyển</td>
                <td className="py-2 text-right">0 đ</td>
              </tr>
              <tr>
                <td className="py-2 font-bold">Thanh toán khi nhận hàng</td>
                <td className="py-2 text-right font-bold">1.400.000 đ</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Địa chỉ đặt hàng</h2>
          <p>Họ và tên:  {customerInfo.name}</p>
          <p>Số điện thoại:  {customerInfo.phone}</p>
          <p>Địa chỉ: {customerInfo.address}, {customerInfo.wards},{' '}
            {customerInfo.districts}, {customerInfo.city}</p>
          <p className="mt-2">Phương thức thanh toán: Thanh toán khi nhận hàng</p>
        </div>
      </div>

      {/* Lựa chọn giao hàng */}
      <div className="bg-white p-5 rounded-lg shadow-md mt-5">
        <h2 className="text-lg font-bold mb-4">Lựa chọn giao hàng</h2>
        <p>Họ tên:  {customerInfo.name}</p>
        <p>Số điện thoại: {customerInfo.phone}</p>
        <p>Địa chỉ: {customerInfo.address}, {customerInfo.wards},{' '}
          {customerInfo.districts}, {customerInfo.city}</p>
      </div>
    </div>
  );
}

export default OrderDetail;
