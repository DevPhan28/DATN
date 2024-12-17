import { toast, usePrompt } from '@medusajs/ui';
import instance from '@/api/axiosIntance';
import { AxiosError } from 'axios';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import CurrencyVND from '@/components/config/vnd';

export const Route = createFileRoute('/_layout/refund/$userId/$orderId')({
  component: RefundRequestPage,
});
type Order = {
  status: 'delivered' | 'received' | 'pending';
  items: {
    productId: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
    totalPrice : string
  }[];
};

function RefundRequestPage() {
  const { orderId } = useParams({ from: '/_layout/refund/$userId/$orderId' });
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [returnType] = useState('complaint');
  const [loading, setLoading] = useState(false);
  const dialog = usePrompt();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser?.user?._id;
    const userEmail = storedUser?.user?.email;
    if (userEmail) {
      setEmail(userEmail);
    }
    if (!userId || !orderId) {
      console.error('userId hoặc orderId không tồn tại');
      return;
    }

    
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await instance.get(`/orders/${userId}/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            `Lỗi: ${error.response?.data?.message || 'Không thể lấy dữ liệu.'}`
          );
        } else {
          toast.error('Lỗi mạng, vui lòng thử lại.');
        }
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);
  const handleSubmit = async () => {
    if (
      !order ||
      (order.status !== 'delivered' && order.status !== 'received')
    ) {
      toast.error('Chỉ có thể hoàn trả đơn hàng đã giao hoặc đã nhận.');
      return;
    }

    if (!reason) {
      toast.error('Vui lòng chọn lý do hoàn trả!');
      return;
    }
    if (!description || !email) {
      toast.error('Vui lòng nhập đầy đủ thông tin mô tả và email.');
      return;
    }

    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail(email)) {
      toast.error('Vui lòng nhập email hợp lệ.');
      return;
    }
    const userHasConfirmed = await dialog({
      title: 'Khiếu nại đơn hàng',
      description: 'Bạn có chắc chắn muốn khiếu nại đơn hàng này không?',
    });

    if (!userHasConfirmed) {
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser?.user?._id;

      if (!userId || !orderId) {
        toast.error('Không tìm thấy thông tin người dùng hoặc đơn hàng.');
        return;
      }

      await instance.put(`/orders/${orderId}/return`, {
        reason,
        description,
        email,
        returnType,
      });

      toast.success('Yêu cầu hoàn trả thành công');
      navigate({ to: '/orderuser' });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          `Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra.'}`
        );
      } else {
        toast.error(
          'Có lỗi xảy ra khi gửi yêu cầu hoàn trả. Vui lòng thử lại sau.'
        );
      }
      console.error('Lỗi khi gửi yêu cầu hoàn trả:', error);
    }
  };

  if (loading) {
    return <div>Đang tải thông tin...</div>;
  }
  if (!order) {
    return <div>Không tìm thấy thông tin đơn hàng.</div>;
  }
  if (!order || !order.items || order.items.length === 0) {
    return <div className="text-center">Đơn hàng không có sản phẩm nào.</div>;
  }

  return (
    <div className="mx-auto mt-8 max-w-3xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Tình huống bạn đang gặp?</h2>
      <p className="mb-6 text-gray-600">
        Tôi đã nhận hàng nhưng không còn nhu cầu/hàng có vấn đề (bể vỡ, sai mẫu,
        lỗi, khác mô tả...)
      </p>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Sản phẩm đã chọn</h3>
        {order.items.map((item: any) => (
          <div
            key={item.productId}
            className="mb-4 flex items-center space-x-4 border-b pb-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 rounded object-cover"
            />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-600">Màu: {item.color}</p>
              <p className="text-gray-600">Kích thước: {item.size}</p>
              <p className="text-gray-600">Số lượng: {item.quantity}</p>
              <p className="text-gray-600">
                Giá: {item.price.toLocaleString()} đ
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">
          Chọn sản phẩm cần Trả hàng và Hoàn tiền
        </h3>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Lý do:
        </label>
        <select
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="mb-4 w-full rounded border p-2"
        >
          <option value="">Chọn Lý Do</option>
          <option value="Thiếu hàng">Thiếu hàng</option>
          <option value="Người bán gửi sai hàng">Người bán gửi sai hàng</option>
          <option value="Hàng bễ vỡ">Hàng bễ vỡ</option>
          <option value="Hàng lỗi, không hoạt động">
            Hàng lỗi, không hoạt động
          </option>
          <option value="Hàng hết hạn sử dụng">Hàng hết hạn sử dụng</option>
          <option value="Khác với mô tả">Khác với mô tả</option>
          <option value="Hàng đã qua sử dụng">Hàng đã qua sử dụng</option>
          <option value="Hàng giả, nhái">Hàng giả, nhái</option>
          <option value="Hàng nguyên vẹn nhưng không còn nhu cầu">
            Hàng nguyên vẹn nhưng không còn nhu cầu
          </option>
        </select>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mô tả:
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mb-4 w-full rounded border p-2"
          placeholder="Chi tiết vấn đề bạn gặp phải"
          rows={4}
          maxLength={2000}
        ></textarea>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Thông tin hoàn tiền</h3>
        <div className="mb-2 flex justify-between">
          <span>Số tiền hoàn lại:</span>
          <span><CurrencyVND amount={order.totalPrice}/></span>
        </div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email:
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full rounded border p-2"
          placeholder="Nhập địa chỉ email của bạn"
        />
      </div>

      <div className="text-right">
        <button
          onClick={() => navigate({ to: '/orderuser' })}
          className="mr-4 rounded bg-gray-500 px-6 py-2 font-semibold text-white hover:bg-gray-600"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="rounded bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
        >
          Hoàn thành
        </button>
      </div>
    </div>
  );
}

export default RefundRequestPage;
