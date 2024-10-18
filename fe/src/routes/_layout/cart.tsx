import { useState } from 'react'; 
import { createFileRoute } from '@tanstack/react-router';
import { useFetchCart } from '@/data/cart/useFetchCart';
import { useNavigate } from '@tanstack/react-router';

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
    return <div>Đang tải...</div>;  // Hiển thị trạng thái đang tải
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

  // Xử lý khi có lỗi
  if (error) {
    return <div>Lỗi khi tải giỏ hàng: {error.message}</div>;  // Hiển thị lỗi nếu có
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

  return (
    <div className="max-w-6xl m-auto">
      <div className="p-2 mt-5">
        <div className="flex md:max-w-3xl w-full">
          <div className="flex-none w-14">Home</div>
          <div className="flex-initial w-7">
            <i className="fa-solid fa-chevron-right"></i>
          </div>
          <div className="flex-initial text-gray-500">Giỏ hàng</div>
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row mt-10 gap-8 md:gap-12 lg:gap-16">
          <div className="flex-none w-full md:w-[70%]">
            <div className="flex justify-evenly border border-slate-300 py-2 md:max-w-3xl w-full items-center">
              <div className="flex-initial text-center font-bold uppercase text-gray-600 px-4">
                Sản phẩm
              </div>
              <div className="flex-grow text-center font-bold uppercase text-gray-600 px-4">
                Giá
              </div>
              <div className="flex-grow text-center font-bold uppercase text-gray-600 px-4">
                Số lượng
              </div>
              <div className="flex-grow text-center font-bold uppercase text-gray-600 px-4">
                Size
              </div>
              <div className="flex-grow text-center font-bold uppercase text-gray-600 px-4">
                Color
              </div>
              <div className="flex-grow text-center font-bold uppercase text-gray-600 px-4">
                Tổng cộng
              </div>
              <div className="flex-grow text-center font-bold uppercase text-gray-600 px-4">
                Hành động
              </div>
            </div>

            {/* Hiển thị các sản phẩm trong giỏ hàng */}
            {cartData?.products?.map((product: any, index: any) => (
              <div key={product.productId} className="border-l border-r border-b border-slate-300 md:max-w-3xl w-full">
                <div className="flex justify-around items-center p-4">
                  <div className="">
                    <img src={product.image} alt={product.name} className="w-16 h-auto" />
                    <div>{product.name}</div>
                  </div>
                  <div className="text-lg">${productPrice(index).toFixed(2)}</div>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button onClick={() => decrementQuantity(index)} className="flex-1 py-2 px-4 border-r hover:bg-blue-400">-</button>
                    <input
                      type="number"
                      min="0"
                      value={quantities[index] || product.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)} // Cập nhật số lượng
                      className="flex-1 py-2 text-center border-none w-16"
                    />
                    <button onClick={() => incrementQuantity(index)} className="flex-1 py-2 px-4 border-l hover:bg-blue-400">+</button>
                  </div>

                  {/* Hiển thị size */}
                  <div className="text-lg text-center">
                    {product.size ? product.size : 'Không có'}
                  </div>

                  {/* Hiển thị color */}
                  <div className="text-lg text-center">
                    {product.color ? product.color : 'Không có'}
                  </div>

                  <div className="text-lg text-center">
                    ${(quantities[index] || product.quantity) * productPrice(index)}.00 {/* Tính tổng */}
                  </div>
                </div>
              </div>
            ))}

            {/* Phần nhập mã giảm giá và cập nhật giỏ hàng */}
            <div className="border-l border-r border-b border-slate-300 md:max-w-3xl w-full">
              <div className="flex flex-wrap justify-around items-center p-4 gap-4">
                <div className="flex-none">
                  <div className="p-2 border border-gray-400 rounded-2xl">
                    <input type="text" placeholder="Mã giảm giá" className="focus:outline-none w-full" />
                  </div>
                </div>
                <div className="flex-none">
                  <button className='px-6 py-2 border border-gray-300 rounded-2xl bg-gray-100 hover:bg-blue-400'>Áp dụng mã</button>
                </div>
                <div className="flex-none">
                  <button className='px-6 py-2 border border-gray-300 rounded-2xl bg-gray-100 hover:bg-blue-400'>Cập nhật giỏ hàng</button>
                </div>
              </div>
            </div>
          </div>

          {/* Phần tổng tiền giỏ hàng */}
          <div className='p-10 w-full md:w-[30%] lg:max-w-lg border border-gray-300'>
            <div className="w-full">
              <h2 className='uppercase font-bold text-xl'>Tổng tiền giỏ hàng</h2>
              <div className="flex items-center mt-5">
                <div className='w-32 flex-none font-medium'>Tạm tính:</div>
                <div className="flex-none text-lg">
                  ${(cartData?.products?.reduce((sum: any, product: any, index: any) => sum + (quantities[index] || product.quantity) * productPrice(index), 0)).toFixed(2)}
                </div>
              </div>
              <hr className="mt-3 border border-gray-300" />
              <div className="flex items-center mt-5">
                <div className='w-32 flex-none font-bold text-xl'>Tổng cộng:</div>
                <div className="flex-none text-xl">
                  ${(cartData?.products?.reduce((sum: any, product: any, index: any) => sum + (quantities[index] || product.quantity) * productPrice(index), 0)).toFixed(2)}
                </div>
              </div>
              <div className="flex-none mt-5">
                <button className='p-4 w-full border border-gray-300 uppercase text-lg text-white font-bold rounded-3xl text-[15px] bg-black hover:bg-blue-400'>Tiến hành thanh toán</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
