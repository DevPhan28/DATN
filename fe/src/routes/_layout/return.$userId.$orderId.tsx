import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';

export const Route = createFileRoute('/_layout/return/$userId/$orderId')({
  component: ReturnRequestPage,
});

function ReturnRequestPage() {
  const { orderId } = useParams({ from: '/_layout/return/$userId/$orderId' });
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [returnType, setReturnType] = useState('refund'); // Trạng thái cho loại hoàn trả

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.user?._id;

    if (!userId || !orderId) {
      console.error('userId hoặc orderId không tồn tại');
      navigate('/error');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await instance.get(`/orders/${userId}/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        navigate('/error');
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleSubmit = async () => {
    // Kiểm tra nếu lý do, mô tả, và email đều đã nhập
    if (!reason) {
      toast.error('Vui lòng chọn lý do hoàn trả.');
      return;
    }
    if (!description || !email) {
      toast.error('Vui lòng nhập đầy đủ thông tin mô tả và email.');
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?.user?._id;

      await instance.put(`/orders/${orderId}/return`, {
        reason,
        description,
        email,
        returnType, // Truyền loại hoàn trả
      });

      toast.success('Yêu cầu hoàn trả thành công');
      navigate({ to: '/orderuser' }); // Điều hướng lại trang đơn hàng của người dùng sau khi hoàn thành
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu hoàn trả:', error);
      toast.error(
        'Có lỗi xảy ra khi gửi yêu cầu hoàn trả. Vui lòng thử lại sau.'
      );
    }
  };

  if (!order) {
    return <div>Đang tải thông tin đơn hàng...</div>;
  }

  const totalRefundAmount = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto mt-8 max-w-3xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Tình huống bạn đang gặp?</h2>
      <p className="mb-6 text-gray-600">
        Tôi đã nhận hàng nhưng không còn nhu cầu/hàng có vấn đề (bể vỡ, sai mẫu,
        lỗi, khác mô tả...)
      </p>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Sản phẩm đã chọn</h3>
        {order.items.map(item => (
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
          onChange={e => {
            setReason(e.target.value);
            // Cập nhật loại hoàn trả dựa trên lý do được chọn
            if (
              [
                'Sản phẩm bị lỗi hoặc hỏng hóc',
                'Sai sản phẩm hoặc giao nhầm',
                'Chất lượng kém',
                'Kích cỡ không đúng hoặc không vừa',
                'Không giống hình ảnh quảng cáo',
                'Không đúng như mô tả',
              ].includes(e.target.value)
            ) {
              setReturnType('refund');
            } else {
              setReturnType('exchange');
            }
          }}
          className="mb-4 w-full rounded border p-2"
        >
          <option value="">Chọn Lý Do</option>
          <option value="Sản phẩm bị lỗi hoặc hỏng hóc">
            Sản phẩm bị lỗi hoặc hỏng hóc
          </option>
          <option value="Sai sản phẩm hoặc giao nhầm">
            Sai sản phẩm hoặc giao nhầm
          </option>
          <option value="Chất lượng kém">Chất lượng kém</option>
          <option value="Kích cỡ không đúng hoặc không vừa">
            Kích cỡ không đúng hoặc không vừa
          </option>
          <option value="Không giống hình ảnh quảng cáo">
            Không giống hình ảnh quảng cáo
          </option>
          <option value="Không đúng như mô tả">Không đúng như mô tả</option>
          <option value="Không còn nhu cầu">Không còn nhu cầu</option>
          <option value="Không đúng phong cách hoặc nhu cầu cá nhân">
            Không đúng phong cách hoặc nhu cầu cá nhân
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
          <span>{totalRefundAmount.toLocaleString()} đ</span>
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
          onClick={handleSubmit}
          className="rounded bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
        >
          Hoàn thành
        </button>
      </div>
    </div>
  );
}

export default ReturnRequestPage;
