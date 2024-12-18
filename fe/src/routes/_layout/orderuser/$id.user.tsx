
import instance from '@/api/axiosIntance';
import CurrencyVND from '@/components/config/vnd';
import { toast } from '@medusajs/ui';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_layout/orderuser/$id/user')({
  component: DetailOrderUser,
});

function DetailOrderUser() {
  const { id } = useParams({ from: '/_layout/orderuser/$id/user' });
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <div>Loading...</div>;
  }

  if (!orderDetail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold text-gray-600">Không tìm thấy đơn hàng.</div>
      </div>
    );
  }

  const {
    orderNumber,
    customerInfo,
    items = [],
    totalPrice,
    status,
    paymentMethod,
    paymentStatus,
    note,
    voucher,
    createdAt,
    shippingMessageDisplay,
    receivedAt,
  } = orderDetail;

  const formatDate = (date) => new Date(date).toLocaleString();
  const total = items.map(item => item.price * item.quantity)
    .reduce((sum, price) => sum + price, 0);

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-right text-red-500 font-semibold text-sm mb-4">MÃ ĐƠN HÀNG: {orderNumber}</div>
        {/* <div className="text-right text-green-600 font-bold mb-6">ĐƠN HÀNG ĐÃ HOÀN THÀNH</div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full mx-auto">1</div>
            <p className="text-gray-600 text-sm mt-2">Đơn Hàng Đã Đặt</p>
            <p className="text-gray-400 text-xs">{formatDate(createdAt)}</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full mx-auto">2</div>
            <p className="text-gray-600 text-sm mt-2">Đơn Hàng Đã Thanh Toán</p>
            <p className="text-gray-400 text-xs">(₫300.040)</p>
            <p className="text-gray-400 text-xs">14:52 10-12-2024</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full mx-auto">3</div>
            <p className="text-gray-600 text-sm mt-2">Đã Giao Cho ĐVVC</p>
            <p className="text-gray-400 text-xs">15:41 10-12-2024</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full mx-auto">4</div>
            <p className="text-gray-600 text-sm mt-2">Đã Nhận Được Hàng</p>
            <p className="text-gray-400 text-xs">{formatDate(receivedAt)}</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full mx-auto">★</div>
            <p className="text-gray-600 text-sm mt-2">Đánh Giá</p>
          </div>
        </div>

        <hr /> */}

        <div className="mt-10">
          <div className="flex items-center gap-10">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img src={item.image} alt="" className="h-40 object-cover" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-gray-500">Phân loại hàng: <span className="text-black">{item.color}, {item.size}</span></div>
                    <div>x{item.quantity}</div>
                    <div>Giá: <CurrencyVND amount={item.price} /></div>
                  </div>

                </div>

              ))
            ) : (
              <div className="px-4 py-4 text-center text-sm text-gray-500">Không có sản phẩm nào trong đơn hàng.</div>
            )}
          </div>

          <div className="flex items-center justify-end mt-10">
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg border">
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span className="text-gray-800 font-medium"><CurrencyVND amount={total} /></span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-gray-800 font-medium">{shippingMessageDisplay?.props?.amount ? (
                  <CurrencyVND
                    amount={
                      shippingMessageDisplay.props.amount
                    }
                  />
                ) : (
                  <span className="text-gray-600">
                    Miễn phí vận chuyển
                  </span>
                )}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="text-gray-600">Giảm giá</span>
                <span className="text-green-500 font-medium">{voucher ? (
                  <CurrencyVND
                    amount={
                      voucher
                    }
                  />
                ) : (
                  <span className="text-gray-600">
                    0đ
                  </span>
                )}</span>
              </div>
              <div className="flex justify-between text-lg py-4 font-bold text-red-500">
                <span>Thành tiền</span>
                <span><CurrencyVND amount={totalPrice} /></span>
              </div>
              <div className="mt-4 text-gray-600 text-sm">
                <p className="mb-1">Phương thức Thanh toán {paymentMethod} ({paymentStatus})</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
