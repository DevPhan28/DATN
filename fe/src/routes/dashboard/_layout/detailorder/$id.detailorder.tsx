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
        const response = await instance.get(`/orders/${id}`);
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
      <div className="mb-8 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p>
              <strong className="text-gray-800">Mã đơn hàng:</strong> {orderNumber}
            </p>
            <p>
              <strong className="text-gray-800">Ngày tạo:</strong> {formatDate(createdAt)}
            </p>
            {receivedAt && (
              <p>
                <strong className="text-gray-800">Ngày nhận:</strong> {formatDate(receivedAt)}
              </p>
            )}
          </div>
          <div>
            <p>
              <strong className="text-gray-800">Tổng giá trị:</strong> {totalPrice.toLocaleString()} ₫
            </p>
            <p>
              <strong className="text-gray-800">Trạng thái:</strong>{' '}
              <span className={`font-semibold ${status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                {status}
              </span>
            </p>
            <p>
              <strong className="text-gray-800">Phương thức thanh toán:</strong>{' '}
              {paymentMethod} ({paymentStatus})
            </p>
            {note && (
              <p>
                <strong className="text-gray-800">Ghi chú:</strong> {note}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-gray-800">Thông tin khách hàng</h3>
        <div className="text-sm text-gray-600">
          <p>
            <strong className="text-gray-800">Họ tên:</strong> {customerInfo.name}
          </p>
          <p>
            <strong className="text-gray-800">Số điện thoại:</strong> {customerInfo.phone}
          </p>
          <p>
            <strong className="text-gray-800">Email:</strong> {customerInfo.email}
          </p>
          <p>
            <strong className="text-gray-800">Địa chỉ:</strong>{' '}
            {`${customerInfo.address}, ${customerInfo.wards}, ${customerInfo.districts}, ${customerInfo.city}`}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-gray-800">Danh sách sản phẩm</h3>
        <Table>
          <Table.Row className="bg-gray-100">
            <Table.HeaderCell className="font-semibold text-gray-700">Tên sản phẩm</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-gray-700">Số lượng</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-gray-700">Giá</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-gray-700">Ảnh</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-gray-700">Màu</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-gray-700">Size</Table.HeaderCell>
            <Table.HeaderCell className="font-semibold text-gray-700">Trọng lượng</Table.HeaderCell>
          </Table.Row>
          <Table.Body>
            {items.length > 0 ? (
              items.map((item) => (
                <Table.Row key={item._id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{item.price.toLocaleString()}₫</Table.Cell>
                  <Table.Cell>
                    <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-lg" />
                  </Table.Cell>
                  <Table.Cell>{item.color || 'N/A'}</Table.Cell>
                  <Table.Cell>{item.size || 'N/A'}</Table.Cell>
                  <Table.Cell>{item.weight ? `${item.weight}g` : 'N/A'}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={7} className="text-center text-gray-500">
                  Không có sản phẩm nào trong đơn hàng.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

export default OrderDetail;
