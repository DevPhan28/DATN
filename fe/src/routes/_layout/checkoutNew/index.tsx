import CurrencyVND from '@/components/config/vnd';
import { useFetchAddressById } from '@/data/address/useFetchAddressByid';
import useCartMutation from '@/data/cart/useCartMutation';
import useCheckoutMutation from '@/data/oder/useOderMutation';
import { toast } from '@medusajs/ui';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_layout/checkoutNew/')({
  component: NewCheckout,
});

function NewCheckout() {
  const [userId, setUserId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');

  const location = useLocation();

  const handlePaymentMethodChange = method => {
    setPaymentMethod(method);
  };
  const selectedItems = Array.isArray(location.state?.selectedItems)
    ? location.state.selectedItems
    : [];

  const totalQuantity = selectedItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const totalAmount = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  const { data, isLoading, error, refetch } = useFetchAddressById(userId);

  const { createOrder } = useCheckoutMutation();
  const { deleteItemFromCart } = useCartMutation();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    const items = Array.isArray(selectedItems) ? selectedItems : [];
    const variantIds = items.map(item => item.variantId);
    const formData = {
      userId,
      items: items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        color: item.color,
        size: item.size,
      })),
      customerInfo: {
        name: data?.data.name,
        phone: data?.data.phone,
        city: data?.data.city,
        districts: data?.data.district,
        wards: data?.data.ward,
        address: data?.data.address,
      },
      paymentMethod,
      paymentStatus: 'pending',
      note: '',
      totalPrice: totalAmount,
      couponCode: 0,
      shippingMessageDisplay: 0,
      discount: 0,
    };

    try {
      await createOrder.mutateAsync(formData);
      await deleteItemFromCart.mutateAsync({
        userId: userId || '',
        variantIds: variantIds,
      });
      toast.success('Order placed successfully');
    } catch (error) {
      toast.error('Có lỗi xảy ra trong quá trình thanh toán');
      console.error('Error during checkout process:', error);
    }
  };

  return (
    <div className="px-[35px]">
      <div className="p-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">| Thanh toán</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="col-span-2 space-y-4">
              <div className="rounded bg-white p-4 shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Địa chỉ nhận hàng</h2>
                  <button className="text-sm text-blue-500">Thay đổi</button>
                </div>
                <div className="mt-2 text-sm">
                  <p>
                    <strong>Họ tên:</strong> {data?.data.name}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {data?.data.phone}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {data?.data.address}, Xã{' '}
                    {data?.data.ward}, Huyện {data?.data.district}, Thành phố{' '}
                    {data?.data.city}
                  </p>
                  <button className="mt-2 text-sm text-blue-500">
                    Mặc định
                  </button>
                </div>
              </div>

              <div className="rounded bg-white p-4 shadow">
                <h2 className="mb-4 text-lg font-medium">Sản phẩm</h2>
                {selectedItems.map(product => (
                  <div className="mb-4 flex items-center border-b pb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="ml-4 flex-grow">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Màu: {product.color} | Size: {product.size}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>x{product.quantity}</p>
                      <p className="font-medium">
                        <CurrencyVND amount={product.price} />
                      </p>
                    </div>
                  </div>
                ))}
                <div className="text-right font-medium">
                  Tổng số tiền ({totalQuantity} sản phẩm):{' '}
                  <span className="text-red-500">
                    <CurrencyVND amount={totalAmount} />
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded bg-white p-4 shadow">
                <h2 className="text-lg font-medium">Chi tiết thanh toán</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng</span>
                    <span>
                      <CurrencyVND amount={totalAmount} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>0 đ</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Tổng thanh toán:</span>
                    <span className="text-red-500">
                      {' '}
                      <CurrencyVND amount={totalAmount} />
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded bg-white p-4 shadow">
                <h2 className="text-lg font-medium">Nhập mã giảm giá</h2>
                <div className="mt-2 flex">
                  <input
                    type="text"
                    className="flex-grow rounded-l border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã giảm giá"
                  ></input>
                  <button className="rounded-r bg-orange-500 px-4 text-white hover:bg-orange-600">
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="rounded bg-white p-4 shadow">
                <h2 className="text-lg font-medium">Ghi chú</h2>
                <textarea
                  className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Thêm ghi chú..."
                ></textarea>
              </div>
              {/* Phương thức thanh toán */}
              <div className="rounded bg-white p-4 shadow">
                <p className="mb-3 font-medium text-gray-700">
                  Phương thức thanh toán
                </p>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('cod')}
                    className={`w-full rounded-lg border p-3 ${paymentMethod === 'cod' ? 'border-red-500 bg-red-100' : ''} focus:outline-none sm:w-auto`}
                  >
                    Thanh toán khi nhận hàng (COD)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('online')}
                    className={`flex w-full rounded-lg border p-3 ${paymentMethod === 'online' ? 'border-red-500 bg-red-100' : ''} focus:outline-none sm:w-auto`}
                  >
                    Thanh toán qua{' '}
                    <img
                      className="ml-2 mt-1 w-14"
                      src="./zalo_pay.png"
                      alt=""
                    />
                  </button>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều
                  khoản của FASHIONZONE
                </p>
                <button className="mt-5 w-full rounded-lg bg-orange-500 py-2 font-semibold text-white transition hover:bg-orange-600">
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
