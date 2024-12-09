import instance from '@/api/axiosIntance';
import { Table, toast } from '@medusajs/ui';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute(
  '/dashboard/_layout/detailorder/$id/detailorder'
)({
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = useParams({ from: '/dashboard/_layout/detailorder/$id/detailorder' });
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
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
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
    items,
    totalPrice,
    status,
    paymentMethod,
    paymentStatus,
    note,
    createdAt,
    receivedAt,
  } = orderDetail;

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
     <div>
  <div className="px-4 sm:px-0">
    <h1 className="text-base/7 font-semibold text-gray-900">Chi tiết đơn hàng</h1>
    <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Thông tin đơn hàng và chi tiết.</p>
  </div>
  <div className="mt-6 border-t border-gray-100">
    <dl className="divide-y divide-gray-100">
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm/6 font-medium text-gray-900">Mã đơn hàng</dt>
        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{orderNumber}</dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm/6 font-medium text-gray-900">Ngày tạo</dt>
        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{formatDate(createdAt)}</dd>
      </div>
      {receivedAt && (
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm/6 font-medium text-gray-900">Ngày nhận</dt>
          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{formatDate(receivedAt)}</dd>
        </div>
      )}
     
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm/6 font-medium text-gray-900">Trạng thái</dt>
        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
          <span className={`font-semibold ${status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
            {status}
          </span>
        </dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm/6 font-medium text-gray-900">Phương thức thanh toán</dt>
        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
          {paymentMethod} ({paymentStatus})
        </dd>
      </div>
      {note && (
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm/6 font-medium text-gray-900">Ghi chú</dt>
          <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{note}</dd>
        </div>
      )}
    </dl>
  </div>

  <div className="mt-6 border-t border-gray-100">
    <h3 className=" text-base/7 font-semibold text-gray-900">Thông tin khách hàng</h3>
    <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Chi tiết khách hàng.</p>
    <dl className="divide-y divide-gray-100">
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm/6 font-medium text-gray-900">Họ tên</dt>
        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customerInfo.name}</dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm/6 font-medium text-gray-900">Số điện thoại</dt>
        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customerInfo.phone}</dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm/6 font-medium text-gray-900">Email</dt>
        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{customerInfo.email}</dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm/6 font-medium text-gray-900">Địa chỉ</dt>
        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
          {`${customerInfo.address}, ${customerInfo.wards}, ${customerInfo.districts}, ${customerInfo.city}`}
        </dd>
      </div>
    </dl>
  </div>

  <div className="mt-6 border-t border-gray-100">
  <h3 className="text-base/7 font-semibold text-gray-900">Danh sách sản phẩm</h3>
  <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Chi tiết các sản phẩm trong đơn hàng.</p>
  <div className="mt-4 overflow-x-auto">
    <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tên sản phẩm</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ảnh</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Số lượng</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Màu</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trọng lượng</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tổng tiền</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {items.length > 0 ? (
          items.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm text-gray-900">{item.name}</td>
              <td className="px-4 py-4 text-sm text-gray-700"> <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-lg" /></td>
              <td className="px-4 py-4 text-sm text-gray-700">{item.quantity}</td>
              <td className="px-4 py-4 text-sm text-gray-700">{item.price.toLocaleString()} ₫</td>
              <td className="px-4 py-4 text-sm text-gray-700">{item.color }</td>
              <td className="px-4 py-4 text-sm text-gray-700">{item.size }</td>
              <td className="px-4 py-4 text-sm text-gray-700">{item.weight }</td>
              <td className="px-4 py-4 text-sm text-gray-700">{totalPrice.toLocaleString()} ₫</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
              Không có sản phẩm nào trong đơn hàng.
            </td>
          </tr>
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
