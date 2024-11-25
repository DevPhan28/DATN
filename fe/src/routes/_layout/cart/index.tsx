import ErrorCart from '@/components/errors/error-cart';
import LoginCart from '@/components/errors/error-login-cart';
import { useCart } from '@/data/cart/useCartLogic';
import { ChevronRightMini, ReceiptPercent } from '@medusajs/icons';
import { toast } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
export const Route = createFileRoute('/_layout/cart/')({
  component: Cart,
});

function Cart() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  if (!userId) {
    return <LoginCart />;
  }

  const {
    cartData,
    isLoading,
    quantities,
    selectedProducts,
    selectAll,
    handleQuantityChange,
    incrementQuantity,
    decrementQuantity,
    productPrice,
    handleDeleteSelectedProducts,
    toggleSelectProduct,
    toggleSelectAll,
    totalSelectedPrice,
    getSelectedItems,
  } = useCart(userId);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!cartData || !cartData.products || cartData.products.length === 0) {
    return <ErrorCart />;
  }

  const handleCheckout = () => {
    const selectedItems = getSelectedItems() || [];
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    navigate({
      to: '/checkout',
      state: { selectedItems } as any ,
    });
  };
  return (
    <div className="">
      <div className="main-content flex h-48 w-full flex-col items-center justify-center">
        <div className="text-content">
          <div className="text-center text-4xl font-semibold">Cart</div>
          <div className="link caption1 mt-3 flex items-center justify-center gap-1">
            <div className="flex items-center justify-center">
              <a href="/">Home</a>
              <ChevronRightMini />
            </div>
            <div className="capitalize text-gray-500">
              <a href="#">cart</a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50">
        <div className="mx-auto mb-10 max-w-7xl py-10 pt-10">
          <div className="w-full flex-none">
            <table className="min-w-full">
              <thead className="shadow">
                <tr className="bg-white font-bold uppercase text-gray-600">
                  <th className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="w-28 text-left">Sản Phẩm</th>
                  <th className="text-center">Giá</th>
                  <th className="text-center">Số Lượng</th>
                  <th className="text-center">Tổng</th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {cartData?.products?.map((product, index) => (
                  <tr key={product.productId} className="shadow">
                    <td className="px-4 py-4 text-center">
                      <input
                        className="h-4 w-4"
                        type="checkbox"
                        checked={selectedProducts[index] || false}
                        onChange={() => toggleSelectProduct(index)}
                      />
                    </td>
                    <td className="flex items-center gap-x-2 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-auto w-12"
                      />
                      <div className="w-32 truncate">
                        {product.name}
                        <span className="text-gray-400">
                          <div className="flex">
                            <div>{product.color || 'Không có'}</div>
                            <div>, Size: {product.size || 'Không có'}</div>
                          </div>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {productPrice(index)} VND
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => decrementQuantity(index)}
                          className="border px-2 hover:bg-blue-400"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          min="0"
                          value={quantities[index] || product.quantity}
                          onChange={e =>
                            handleQuantityChange(index, e.target.value)
                          }
                          className="w-12 border text-center"
                        />
                        <button
                          onClick={() => incrementQuantity(index)}
                          className="border px-2 hover:bg-blue-400"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {(quantities[index] || product.quantity) *
                        productPrice(index)}{' '}
                      VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-2 bg-white shadow">
              <div className="flex items-center justify-end gap-3 px-4 py-2">
                <ReceiptPercent className="text-orange-600" />
                <span>fashion zone voucher</span>
                <a href="#" className="text-blue-400 hover:underline">
                  Chọn hoặc nhập mã
                </a>
              </div>
              <div className="flex justify-between p-4">
                <div className="ml-10 flex items-center gap-5">
                  <input
                    className="h-4 w-4"
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                  Chọn tất cả({cartData?.products?.length || 0})
                  <button
                    onClick={handleDeleteSelectedProducts}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
                <div className="flex items-center gap-5">
                  <div>
                    Tổng thanh toán (VND):{' '}
                    <span className="text-red-500">
                      {totalSelectedPrice || '0'}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="rounded-md bg-blue-500 px-6 py-3 text-white hover:bg-black"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
