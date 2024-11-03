import ErrorCart from '@/components/errors/error-cart';
import LoginCart from '@/components/errors/error-login-cart';
import useCartMutation from '@/data/cart/useCartMutation';
import { useFetchCart } from '@/data/cart/useFetchCart';
import { ChevronRightMini, ReceiptPercent, Trash } from '@medusajs/icons';
import { toast } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';


export const Route = createFileRoute('/_layout/cart')({
  component: Cart,
});

function Cart() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { data: cartData, isLoading, error } = useFetchCart(userId);
  
  const { deleteItemFromCart, increaseQuantity, decreaseQuantity } =
    useCartMutation();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState(false);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!userId) {
    return (
      <LoginCart />
    );
  }
  if (!cartData || !cartData.products || cartData.products.length === 0) {
    return (
      <ErrorCart />
    )
  }
  const handleQuantityChange = (index: number, value: string) => {
    const quantity = Math.max(parseInt(value) || 0, 0);
    setQuantities(prev => ({
      ...prev,
      [index]: quantity,
    }));
  };

  const incrementQuantity = (index: number) => {
    const newQuantity =
      (quantities[index] || cartData?.products[index].quantity) + 1;
    setQuantities(prev => ({
      ...prev,
      [index]: newQuantity,
    }));
    const product = cartData?.products[index];
    if (product) {
      increaseQuantity.mutate({
        userId: userId || '',
        productId: product.productId,
        variantId: product.variantId,
      });
    }
  };

  const decrementQuantity = (index: number) => {
    const newQuantity = Math.max(
      (quantities[index] || cartData?.products[index].quantity) - 1,
      0
    );
    setQuantities(prev => ({
      ...prev,
      [index]: newQuantity,
    }));
    const product = cartData?.products[index];
    if (product && newQuantity > 0) {
      decreaseQuantity.mutate({
        userId: userId || '',
        productId: product.productId,
        variantId: product.variantId,
      });
    }
  };

  const productPrice = (index: number) => {
    const product = cartData?.products[index];
    const variantPrice = product?.priceAtTime ?? 0;
    return variantPrice > 0 ? variantPrice : product?.price;
  };

  const handleDeleteProduct = (productId: string, variantId: string) => {
    deleteItemFromCart.mutate({ userId: userId || '', productId, variantId });
  };

  const toggleSelectProduct = (index: number) => {
    setSelectedProducts(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      const allSelected = Object.fromEntries(
        cartData?.products.map((_, index) => [index, true]) || []
      );
      setSelectedProducts(allSelected);
    } else {
      setSelectedProducts({});
    }
  };

  const totalSelectedPrice = cartData?.products
    .reduce((sum, product, index) => {
      if (selectedProducts[index]) {
        return (
          sum + (quantities[index] || product.quantity) * productPrice(index)
        );
      }
      return sum;
    }, 0)
    .toFixed(2);

  const getSelectedItems = () => {
    return cartData.products.filter((_, index) => selectedProducts[index]);
  };

  const handleCheckout = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      // alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    navigate({
      to: '/checkout',
      state: { selectedItems },
    });
  };

  return (
    <div className=''>
      <div className="main-content w-full h-48 flex flex-col items-center justify-center ">
        <div className="text-content">
          <div className="text-4xl font-semibold text-center">
            Cart
          </div>
          <div className="link flex items-center justify-center gap-1 caption1 mt-3">
            <div className="flex items-center justify-center">
              <a href="/">Home</a>
              <ChevronRightMini />
            </div>
            <div className="text-gray-500 capitalize">
              <a href="#">cart</a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50">
        <div className="mx-auto mb-10 max-w-7xl pt-10 py-10">
          <div className="w-full flex-none">
            <table className="min-w-full ">
              <thead className="shadow">
                <tr className="font-bold uppercase text-gray-600 bg-white">
                  <th className="px-4 py-3 text-center">
                    <input type="checkbox" className='w-4 h-4' checked={selectAll} onChange={toggleSelectAll} />
                  </th>
                  <th className="w-28 text-left">Sản Phẩm</th>
                  <th className="text-center">Giá</th>
                  <th className="text-center">Số Lượng</th>
                  <th className="text-center">Tổng</th>
                  <th className="text-center">Thao Tác</th>
                </tr>
              </thead>

              {/* Dòng trống để tạo khoảng cách */}
              <tbody>
                <tr>
                  <td colSpan="6" className="py-1"></td>
                </tr>
              </tbody>

              <tbody className='bg-white'>
                {cartData?.products?.map((product, index) => (
                  <tr key={product.productId} className="shadow">
                    <td className="px-4 py-4 text-center">
                      <input
                        className='w-4 h-4'
                        type="checkbox"
                        checked={selectedProducts[index] || false}
                        onChange={() => toggleSelectProduct(index)}
                      />
                    </td>
                    <td className="flex items-center gap-x-2 py-4 ">
                      <img src={product.image} alt={product.name} className="h-auto w-12" />
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
                    <td className="text-center px-4 py-4">${productPrice(index)}</td>
                    <td className="text-center px-4 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => decrementQuantity(index)}
                          className=" border px-2 hover:bg-blue-400"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          min="0"
                          value={quantities[index] || product.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          className=" w-12 border text-center"
                        />
                        <button
                          onClick={() => incrementQuantity(index)}
                          className=" border px-2 hover:bg-blue-400"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-center px-4 py-4">
                      ${((quantities[index] || product.quantity) * productPrice(index)).toFixed(2)}
                    </td>
                    <td className="text-center px-4 py-4">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteProduct(product.productId, product.variantId)}
                      >
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='bg-white mt-2 shadow'>
              <div className='flex justify-end px-4 py-2 gap-3 items-center'>
                <ReceiptPercent className=' text-orange-600' />
                <span>fashion zone voucher</span>
                <a href="#" className="text-blue-400 hover:underline">Chọn hoặc nhập mã</a>
              </div>
              <div className="flex justify-between p-4 ">
                <div className="flex gap-5 items-center ml-10">
                  <input
                    className='w-4 h-4'
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                  Chọn tất cả({cartData?.products?.length || 0})
                  <button onClick={() => handleDeleteAllSelected()}>Xóa</button>
                </div>
                <div className="flex items-center gap-5">

                  <div>
                    Tổng thanh toán: $ <span className="text-red-500">{totalSelectedPrice || '0'}</span>
                  </div>
                  <button onClick={handleCheckout} className="rounded-md bg-blue-500 px-6 py-3 text-white hover:bg-black">
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
