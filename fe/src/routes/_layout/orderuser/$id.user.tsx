import instance from '@/api/axiosIntance';
import CurrencyVND from '@/components/config/vnd';
import { toast } from '@medusajs/ui';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  ArrowUturnLeft,
  Cash,
  Check,
  DocumentText,
  MapPin,
  RocketLaunch,
  StarSolid,
} from '@medusajs/icons';

export const Route = createFileRoute('/_layout/orderuser/$id/user')({
  component: DetailOrderUser,
});

function DetailOrderUser() {
  const { id } = useParams({ from: '/_layout/orderuser/$id/user' });
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusHistory, setStatusHistory] = useState([]);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/orders/${id}/admin`);
        setOrderDetail(response.data);
        console.log(response.data);
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
        <div className="text-lg font-semibold text-gray-600">
          Không tìm thấy đơn hàng.
        </div>
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
    updatedAt,
  } = orderDetail;

  const formatDate = date => new Date(date).toLocaleString();
  const total = items
    .map(item => item.price * item.quantity)
    .reduce((sum, price) => sum + price, 0);

  return (
    <div className="bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between text-sm">
          {/* Nút quay lại */}
          <div className="flex items-center">
            <ArrowUturnLeft className="mr-1" />
            <Link className="font-medium hover:underline" to="/orderuser">
              QUAY LẠI
            </Link>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-red-500">
              MÃ ĐƠN HÀNG: {orderNumber}
            </span>
            <span className="text-gray-500">|</span>
            <span className="font-bold text-green-600">
              {{
                pending: 'ĐANG CHỜ XÁC NHẬN',
                shipped: 'ĐANG VẬN CHUYỂN',
                delivered: 'ĐƠN HÀNG HOÀN THÀNH',
                received: 'GIAO HÀNG THÀNH CÔNG',
              }[status] || status}
            </span>
          </div>
        </div>
        <hr />

        <div className="mt-10">
          {/* Tiến trình đơn hàng */}
          <div className="mb-6 flex items-center justify-around">
            {[
              {
                label: 'Đơn Hàng Đã Đặt',
                icon: <DocumentText className="h-5 w-5 text-white" />,
              },
              {
                label: 'Đã Xác Nhận',
                icon: <Cash className="h-5 w-5 text-white" />,
              },
              {
                label: 'Đang Vận Chuyển',
                icon: <RocketLaunch className="h-5 w-5 text-white" />,
              },
              {
                label: 'Đã Giao Hàng',
                icon: <Check className="h-5 w-5 text-white" />,
              },
              {
                label: 'Đã Nhận',
                icon: <StarSolid className="h-5 w-5 text-white" />,
              },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                  {step.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <hr />
          {/* Địa chỉ nhận hàng */}
          <div className="mb-6 mt-5 flex justify-between">
            <div className="rounded-lg bg-white p-4">
              <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Thông tin nhận hàng
                </span>
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="w-40 font-medium text-gray-800">
                    Tên người nhận:
                  </span>
                  <span>{customerInfo.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-40 font-medium text-gray-800">
                    Số điện thoại:
                  </span>
                  <span>{customerInfo.phone}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-40 font-medium text-gray-800">
                    Địa chỉ:
                  </span>
                  <span>
                    {customerInfo.address}, {customerInfo.wards},{' '}
                    {customerInfo.districts}, {customerInfo.city}
                  </span>
                </div>
              </div>
            </div>

            <div>
              {/* Trạng thái đơn hàng */}
              <div className="mt-5 space-y-3 text-sm">
                {[
                  {
                    status: 'Đơn hàng thành công',
                  },
                  {
                    time: '10:21 24/11/2024',
                    status: 'Đơn hàng giao thành công',
                    note: `Người nhận: ${customerInfo.name}`,
                  },
                  {
                    time: '09:37 23/11/2024',
                    status: 'Đơn hàng đang giao',
                    note: 'Đơn hàng sẽ sớm được giao, vui lòng chú ý điện thoại',
                  },
                  {
                    time: formatDate(updatedAt),
                    status: 'Đơn hàng đang được chuẩn bị',
                    note: 'Shop đang chuẩn bị đơn hàng',
                  },
                  {
                    time: formatDate(createdAt),
                    status: 'Đơn hàng đặt thành công',
                    note: 'Đơn hàng đã được đặt',
                  },
                ].map((log, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                      <DocumentText />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="mr-2">{log.time}</p>
                        <div>
                          <p className="font-semibold text-green-500">
                            {log.status}
                          </p>
                          <p className="mt-1 text-gray-600">{log.note}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr />

          {/* Phần còn lại của mã */}
          <div className="mt-4">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div key={item._id}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt=""
                        className="h-40 w-40 object-cover"
                      />
                      <div>
                        <div className="text-xl font-semibold">{item.name}</div>
                        <div className="text-gray-500">
                          Phân loại:{' '}
                          <span className="text-black">
                            {item.color} - {item.size}
                          </span>
                        </div>
                        <div className="font-semibold">x{item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-right font-semibold text-red-600">
                      <CurrencyVND amount={item.price} />
                    </div>
                  </div>
                  {index !== items.length - 1 && <hr className="my-4" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-center text-sm text-gray-500">
                Không có sản phẩm nào trong đơn hàng.
              </div>
            )}
          </div>
          <hr />
          <div className="mt-10 flex items-center justify-end">
            <div className="w-full max-w-2xl rounded-lg border bg-white p-6">
              <div className="flex justify-between border-b py-2 text-sm">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span className="font-medium text-gray-800">
                  <CurrencyVND amount={total} />
                </span>
              </div>
              <div className="flex justify-between border-b py-2 text-sm">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium text-gray-800">
                  {shippingMessageDisplay?.props?.amount ? (
                    <CurrencyVND amount={shippingMessageDisplay.props.amount} />
                  ) : (
                    <span className="text-gray-600">Miễn phí vận chuyển</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between border-b py-2 text-sm">
                <span className="text-gray-600">Giảm giá</span>
                <span className="font-medium text-green-500">
                  {voucher ? (
                    <CurrencyVND amount={voucher} />
                  ) : (
                    <span className="text-gray-600">0đ</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between py-4 text-lg font-bold text-red-500">
                <span>Thành tiền</span>
                <span>
                  <CurrencyVND amount={totalPrice} />
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="mb-1">Phương thức thanh toán: {paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
