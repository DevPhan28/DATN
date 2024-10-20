import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useFetchCart } from '@/data/cart/useFetchCart';
import { useNavigate } from '@tanstack/react-router';
import { CurrencyDollarSolid, ThumbUp } from "@medusajs/icons";
// Route cho trang Cart
export const Route = createFileRoute('/_layout/cart')({
  component: Cart,
});

// Component Cart
function Cart() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Thay thế bằng user ID thực tế (có thể lấy từ context, session, v.v.)
  const { data: cartData, isLoading, error } = useFetchCart(userId);

  // State để theo dõi số lượng sản phẩm
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  // Xử lý khi dữ liệu đang tải
  if (isLoading) {
    return <div>Đang tải...</div>; // Hiển thị trạng thái đang tải
  }

  if (!userId) {
    return (
      <div className="m-auto max-w-6xl p-10 text-center">
        <h2 className="mb-5 text-xl font-bold">Bạn chưa đăng nhập</h2>
        <button
          onClick={() => navigate({ to: '/login' })} // Điều hướng đến trang đăng nhập
          className="rounded-2xl border border-gray-300 bg-gray-100 px-6 py-2 hover:bg-blue-400"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  // Xử lý khi có lỗi
  if (error) {
    return <div>Lỗi khi tải giỏ hàng: {error.message}</div>; // Hiển thị lỗi nếu có
  }

  // Hàm cập nhật số lượng từ trường nhập liệu
  const handleQuantityChange = (index: number, value: string) => {
    const quantity = Math.max(parseInt(value) || 0, 0); // Đảm bảo số lượng không âm
    setQuantities(prev => ({
      ...prev,
      [index]: quantity,
    }));
  };

  // Hàm để tăng số lượng
  const incrementQuantity = (index: number) => {
    setQuantities(prev => ({
      ...prev,
      [index]: (prev[index] || cartData?.products[index].quantity) + 1,
    }));
  };

  // Hàm để giảm số lượng
  const decrementQuantity = (index: number) => {
    setQuantities(prev => ({
      ...prev,
      [index]: Math.max(
        (prev[index] || cartData?.products[index].quantity) - 1,
        0
      ),
    }));
  };

  // Giá trị sản phẩm có thể được lấy từ API
  const productPrice = (index: number) => {
    const product = cartData?.products[index];
    const variantPrice = product?.priceAtTime ?? 0; // Sử dụng giá tại thời điểm thêm vào giỏ hàng
    return variantPrice > 0 ? variantPrice : product?.price; // Nếu biến thể có giá, dùng giá đó, nếu không dùng giá chung của sản phẩm
  };
  return (
    <div className="mx-auto mb-10 max-w-6xl">
      {' '}
      {/* Added mb-10 for bottom spacing */}
      {/* Breadcrumb Navigation */}
      <div className="mt-5 p-2">
        <div className="flex w-full">
          <div className="w-14 flex-none">Home</div>
          <div className="w-7 flex-initial">
            <i className="fa-solid fa-chevron-right"></i>
          </div>
          <div className="flex-initial text-gray-500">Giỏ hàng</div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16">
        {/* Cart Items Section */}
        <div className="w-full flex-none md:w-[70%]">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-3 font-bold uppercase text-gray-600">
            <div className="flex-1 text-center">Product</div>
            <div className="flex-1 text-center">Price</div>
            <div className="flex-1 text-center">Quantity</div>
            <div className="flex-1 text-center">Phân loại</div>
            <div className="flex-1 text-center">Total</div>
            <div className="flex-1 text-center">Action</div>
          </div>

          {/* Cart Items */}
          {cartData?.products?.map((product, index) => (
            <div
              key={product.productId}
              className="flex items-center justify-between border-b p-4"
            >
              <div className="flex flex-none items-center gap-x-2 ">
                <img
                  src={product.image}
                  alt={product.name}
                  className=" h-auto w-12"

                />
                <div className=''>{product.name}</div>
              </div>

              <div className="flex-1 text-center">
                ${productPrice(index).toFixed(2)}
              </div>
              <div className="flex flex-1 items-center justify-center">
                <button
                  onClick={() => decrementQuantity(index)}
                  className="rounded-l-md border px-2 hover:bg-blue-400"
                >
                  -
                </button>
                <input
                  type="text"
                  min="0"
                  value={quantities[index] || product.quantity}
                  onChange={e => handleQuantityChange(index, e.target.value)}
                  className="mx-2 w-12 border text-center"
                />
                <button
                  onClick={() => incrementQuantity(index)}
                  className="rounded-r-md border px-2 hover:bg-blue-400"
                >
                  +
                </button>
              </div>
              <div className="flex-1 text-center">
                <div className="flex-1 text-center">
                  Size: {product.size || 'Không có'}
                </div>
                <div className="flex-1 text-center">
                  Color: {product.color || 'Không có'}
                </div>
              </div>

              <div className="flex-1 text-center">
                $
                {(
                  (quantities[index] || product.quantity) * productPrice(index)
                ).toFixed(2)}
              </div>
              <div className="flex-1 text-center">
                <button className="text-red-500 hover:text-red-700">Xóa</button>
              </div>
            </div>
          ))}
          <div className='flex items-center gap-x-5 p-6  border-b'>
            <CurrencyDollarSolid className='text-red-500' />
            <div>Voucher giảm đến 50k
            </div>
            <a href="#" className='text-blue-400'>Xem thêm Voucher</a>
          </div>
          <div className='flex items-center gap-x-5 p-6'>
            <ThumbUp className='text-orange-300' />
            <div>Giảm ₫300.000 phí vận chuyển đơn tối thiểu ₫0;
            </div>
            <a href="#" className='text-blue-400'>Tìm hiểu thêm</a>
          </div>

          {/* Apply Coupon and Update Cart */}
          <div className="border-t p-4">
            <div className="flex justify-around">
              <input
                type="text"
                placeholder="Mã giảm giá"
                className="rounded-md border p-2 focus:outline-none"
              />
              <button className="rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-blue-600">
                Áp dụng mã
              </button>
              <button className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400">
                Cập nhật giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="w-full rounded-md border p-10 md:w-[30%] lg:max-w-lg">
          <h2 className="mb-4 whitespace-nowrap text-xl font-bold uppercase">
            Cart Totals
          </h2>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Subtotal:</span>
            <span className="text-lg">
              $
              {cartData?.products
                ?.reduce(
                  (sum, product, index) =>
                    sum +
                    (quantities[index] || product.quantity) *
                    productPrice(index),
                  0
                )
                .toFixed(2)}
            </span>
          </div>
          <hr className="border-gray-300" />
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-bold">Subtotal:</span>
            <span className="text-xl">
              $
              {cartData?.products
                ?.reduce(
                  (sum, product, index) =>
                    sum +
                    (quantities[index] || product.quantity) *
                    productPrice(index),
                  0
                )
                .toFixed(2)}
            </span>
          </div>
          <button className="mt-5 w-full whitespace-nowrap rounded-3xl bg-black p-4 font-bold uppercase text-white hover:bg-blue-600">
            product to checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
