import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useFetchCart } from '@/data/cart/useFetchCart';
import { useNavigate } from '@tanstack/react-router';
import { Trash, MinusMini, Plus } from '@medusajs/icons';
import useCartMutation from '@/data/cart/useCartMutation';

// Route cho trang Cart
export const Route = createFileRoute('/_layout/cart')({
  component: Cart,
});

// Component Cart
function Cart() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
  const { data: cartData, isLoading, error } = useFetchCart(userId); // Fetch giỏ hàng
  const { deleteItemFromCart } = useCartMutation(); // Sử dụng mutation để xóa sản phẩm

  // State để theo dõi số lượng sản phẩm
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  console.log('log data: ', cartData);
  
  // Xử lý khi dữ liệu đang tải
  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!userId) {
    return (
      <div className="max-w-6xl m-auto p-10 text-center">
        <h2 className="text-xl font-bold mb-5">Bạn chưa đăng nhập</h2>
        <button
          onClick={() => navigate({ to: '/login' })} // Điều hướng đến trang đăng nhập
          className="px-6 py-2 border border-gray-300 rounded-2xl bg-gray-100 hover:bg-blue-400"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl m-auto p-10 text-center">
        <h2 className="text-xl font-bold mb-5">Giỏ hàng của bạn hiện tại trống!</h2>
        <button
          onClick={() => navigate({ to: '/' })} // Điều hướng đến trang chủ
          className="px-6 py-2 border border-gray-300 rounded-2xl bg-gray-100 hover:bg-blue-400"
        >
          Mua sắm ngay
        </button>
      </div>
    );
  }

  // Hàm cập nhật số lượng từ trường nhập liệu
  const handleQuantityChange = (index: number, value: string) => {
    const quantity = Math.max(parseInt(value) || 0, 0); // Đảm bảo số lượng không âm
    setQuantities((prev) => ({
      ...prev,
      [index]: quantity,
    }));
  };

  // Hàm để tăng số lượng
  const incrementQuantity = (index: number) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: (prev[index] || cartData?.products[index].quantity) + 1,
    }));
  };

  // Hàm để giảm số lượng
  const decrementQuantity = (index: number) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: Math.max((prev[index] || cartData?.products[index].quantity) - 1, 0),
    }));
  };

  // Giá trị sản phẩm có thể được lấy từ API
  const productPrice = (index: number) => {
    const product = cartData?.products[index];
    const variantPrice = product?.priceAtTime ?? 0; // Sử dụng giá tại thời điểm thêm vào giỏ hàng
    return variantPrice > 0 ? variantPrice : product?.price; // Nếu biến thể có giá, dùng giá đó, nếu không dùng giá chung của sản phẩm
  };

  // Hàm để xóa sản phẩm khỏi giỏ hàng
  const handleDeleteProduct = (productId: string, variantId: string) => {
    deleteItemFromCart.mutate({
      userId: userId || '', 
      productId, 
      variantId, 
      
    });
    console.log("Xóa sản phẩm với productId:", productId, "variantId:", variantId);
  };

  return (
    <div className="container m-auto">
      <div className="p-2 mt-5">
        <div className="flex w-full">
          <div className="flex-none w-14">Home</div>
          <div className="flex-initial w-7">
            <i className="fa-solid fa-chevron-right"></i>
          </div>
          <div className="flex-initial text-gray-500">Giỏ hàng</div>
        </div>
      </div>

      <div>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left p-4">Sản phẩm</th>
              <th className="text-center p-4">Đơn giá</th>
              <th className="text-center p-4">size</th>
              <th className="text-center p-4">color</th>
              <th className="text-center p-4">Số lượng</th>
              <th className="text-center p-4">Số tiền</th>
              <th className="text-center p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cartData?.products?.map((product: any, index: any) => (
              <tr key={product.productId} className="border-b border-gray-200">
                <td className="flex items-center p-4">
                  <img src={product.image} alt={product.name} className="w-16 h-auto mr-4" />
                  <div>
                    <div>{product.name}</div>
                  </div>
                </td>
                <td className="text-center p-4">
                  {productPrice(index).toFixed(2)}₫
                </td>
                <td className="text-center p-4">
                  {product.size || 'N/A'}
                </td>
                <td className="text-center p-4">
                  {product.color || 'N/A'}
                </td>
                <td className="text-center p-4">
                  <div className="flex justify-center items-center">
                    <button onClick={() => decrementQuantity(index)} className="px-2 py-1 border-r">
                      <MinusMini />
                    </button>
                    <input
                      type="text"
                      min="0"
                      value={quantities[index] || product.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className="w-12 text-center"
                    />
                    <button onClick={() => incrementQuantity(index)} className="px-2 py-1 border-l">
                      <Plus />
                    </button>
                  </div>
                </td>
                <td className="text-center p-4">
                  {(quantities[index] || product.quantity) * productPrice(index)}₫
                </td>
                <td className="text-center p-4">
                  <button onClick={() => handleDeleteProduct(product.productId, product.variantId)}>
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tổng cộng và thanh toán */}
        <div className="mt-5 flex justify-between items-center border-t border-gray-300 pt-4 mb-5">
          <div className="text-xl font-bold">Tổng cộng: {(cartData?.products?.reduce((sum: any, product: any, index: any) => sum + (quantities[index] || product.quantity) * productPrice(index), 0))}₫</div>
          <div className="text-xl">
            
          </div>
          <button className="p-4 border border-gray-300 uppercase text-white font-bold rounded-3xl bg-black hover:bg-blue-400">
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
