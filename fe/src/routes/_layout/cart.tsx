import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useFetchCart } from '@/data/cart/useFetchCart';
import { useNavigate } from '@tanstack/react-router';
import { CurrencyDollarSolid, ThumbUp, Trash } from '@medusajs/icons';
import useCartMutation from '@/data/cart/useCartMutation';
import { toast } from '@medusajs/ui';

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
      <div className="m-auto max-w-6xl p-10 text-center">
        <h2 className="mb-5 text-xl font-bold">Bạn chưa đăng nhập</h2>
        <button
          onClick={() => navigate({ to: '/login' })}
          className="rounded-2xl border border-gray-300 bg-gray-100 px-6 py-2 hover:bg-blue-400"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-auto max-w-6xl p-10 text-center">
        <h2 className="mb-5 text-xl font-bold">
          Giỏ hàng của bạn hiện tại trống!
        </h2>
        <button
          onClick={() => navigate({ to: '/' })}
          className="rounded-2xl border border-gray-300 bg-gray-100 px-6 py-2 hover:bg-blue-400"
        >
          Mua sắm ngay
        </button>
      </div>
    );
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
    <div className="mx-auto mb-10 max-w-6xl">
      <div className="mt-5 p-2">
        <div className="flex w-full">
          <Link to="/" className="w-14 flex-none">
            Home
          </Link>
          <div className="w-7 flex-initial">
            <i className="fa-solid fa-chevron-right"></i>
          </div>
          <div className="flex-initial text-gray-500">Cart</div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16">
        <div className="w-full flex-none md:w-[70%]">
          <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-3 font-bold uppercase text-gray-600">
            <div className="flex-2 text-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />{' '}
              Select All
            </div>
            <div className="flex-1 text-center">Select</div>
            <div className="flex-1 text-center">Product</div>
            <div className="flex-1 text-center">Price</div>
            <div className="flex-1 text-center">Quantity</div>
            <div className="flex-1 text-center">Classification</div>
            <div className="flex-1 text-center">Total</div>
            <div className="flex-1 text-center">Action</div>
          </div>

          {cartData?.products?.map((product, index) => (
            <div
              key={product.productId}
              className="flex items-center justify-between border-b p-4"
            >
              <div className="flex-1 text-center">
                <input
                  type="checkbox"
                  checked={selectedProducts[index] || false}
                  onChange={() => toggleSelectProduct(index)}
                />
              </div>
              <div className="flex flex-none items-center gap-x-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-auto w-12"
                />
                <div>{product.name}</div>
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
                <div>Size: {product.size || 'Không có'}</div>
                <div>Color: {product.color || 'Không có'}</div>
              </div>

              <div className="flex-1 text-center">
                $
                {(
                  (quantities[index] || product.quantity) * productPrice(index)
                ).toFixed(2)}
              </div>
              <div className="flex-1 text-center">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() =>
                    handleDeleteProduct(product.productId, product.variantId)
                  }
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-x-5 border-b p-6">
            <CurrencyDollarSolid className="text-red-500" />
            <div>Voucher reduced to 50k</div>
            <a href="#" className="text-blue-400">
              See more Vouchers
            </a>
          </div>
          <div className="flex items-center gap-x-5 p-6">
            <ThumbUp className="text-orange-300" />
            <div>
              Discount VND 300,000 on single shipping fee, minimum VND 0;
            </div>
            <a href="#" className="text-blue-400">
              Learn more
            </a>
          </div>
          <div className="flex items-center justify-between p-4 font-bold">
            <span>Tổng giá trị sản phẩm đã chọn:</span>
            <span>${totalSelectedPrice || '0.00'}</span>
          </div>

          <div className="border-t p-4">
            <div className="flex justify-around">
              <input
                type="text"
                placeholder="discount code"
                className="rounded-md border p-2 focus:outline-none"
              />
              <button className="rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-blue-600">
                apply code
              </button>
              <button className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400">
                Update Cart
              </button>
            </div>
          </div>
        </div>

        <div className="w-full rounded-md border p-10 md:w-[30%] lg:max-w-lg">
          <h2 className="mb-4 whitespace-nowrap text-xl font-bold uppercase">
            Cart Totals
          </h2>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Subtotal:</span>
            <span className="font-bold">${totalSelectedPrice}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full rounded-md bg-blue-400 px-6 py-3 text-white hover:bg-blue-600"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
export default Cart;
