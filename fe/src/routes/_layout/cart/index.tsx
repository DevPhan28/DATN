import CurrencyVND from '@/components/config/vnd';
import ErrorCart from '@/components/errors/error-cart';
import LoginCart from '@/components/errors/error-login-cart';
import { useCart } from '@/data/cart/useCartLogic';
import { toast } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';


import instance from '@/api/axiosIntance';
import { useFetchAddressById } from '@/data/address/useFetchAddressByid';
import useCartMutation from '@/data/cart/useCartMutation';
import { useFetchAvailableCoupons } from '@/data/coupon/useCouponList';
import useCheckoutMutation from '@/data/oder/useOderMutation';
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
export const Route = createFileRoute('/_layout/cart/')({
  component: Cart,
});

function Cart() {
  const navigate = useNavigate();
  const userIdcart = localStorage.getItem('userId');
  if (!userIdcart) {
    return <LoginCart />;
  }

  const {
    cartData,
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
  } = useCart(userIdcart);


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
      state: { selectedItems },
    });
  };

  //checkout
  const [userId, setUserId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalListOpen, setIsModalListOpen] = useState(false);

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [calculatedShippingFee, setCalculatedShippingFee] = useState(0);
  const [shippingMessageDisplay, setShippingMessageDisplay] = useState('');
  const [isVoucherModalOpen, setVoucherModalOpen] = useState(false);
  const [isCouponFreeShipping, setIsCouponFreeShipping] = useState(false);

  const location = useLocation();
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

  const { data: availableCoupons, isLoading: isCouponsLoading } =
    useFetchAvailableCoupons(totalAmount, userId, selectedCoupon?.code);

  const handleCouponChange = coupon => {
    if (!coupon || !coupon.canApply) {
      toast.error(coupon?.message || 'Mã giảm giá không hợp lệ.');
      setSelectedCoupon(null);
      setDiscountAmount(0);
      setIsCouponFreeShipping(false);
      return;
    }

    setSelectedCoupon(coupon);
    setDiscountAmount(
      coupon.isFreeShipping
        ? 0
        : Math.min(
          (coupon.discount / 100) * totalAmount,
          coupon.maxDiscountAmount || Infinity
        )
    );
    setIsCouponFreeShipping(coupon.isFreeShipping);
  };

  const calculateShipping = async () => {
    try {
      const totalWeight = selectedItems.reduce(
        (acc, item) => acc + (item.weight || 0) * item.quantity,
        0
      );

      const response = await instance.post('/calculate-shipping', {
        weight: totalWeight,
        address: {
          district: data?.data?.district,
        },
        orderValue: totalAmount,
      });

      const fee = response.data.shippingFee;
      setCalculatedShippingFee(isCouponFreeShipping ? 0 : fee);
      setShippingMessageDisplay(
        isCouponFreeShipping || fee === 0 ? (
          'Miễn phí vận chuyển'
        ) : (
          <CurrencyVND amount={fee} />
        )
      );
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      setShippingMessageDisplay('Không thể tính phí vận chuyển');
    }
  };

  useEffect(() => {
    if (data?.data?.district) {
      calculateShipping();
    }
  }, [data, totalAmount, isCouponFreeShipping]);

  const handleSubmit = async e => {
    e.preventDefault();

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
      totalPrice: totalAmount - discountAmount + calculatedShippingFee,
      couponCode: selectedCoupon ? selectedCoupon.code : null,
      shippingMessageDisplay,
      discount: discountAmount,
    };

    try {
      await createOrder.mutateAsync(formData);
      await deleteItemFromCart.mutateAsync({
        userId: userId || '',
        variantIds,
      });
      toast.success('Đặt hàng thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra trong quá trình thanh toán');
      console.error('Error during checkout process:', error);
    }
  };

  return (
    <div className='px-[40px]'>
      <main>
        <div className="mb-4 pb-4" />
        <section className="shop-checkout container">
          <h2 className="page-title">Cart</h2>
          <hr />
          <div className="shopping-cart">
            <div className="cart-table__wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Sản Phẩm</th>
                    <th />
                    <th>Giá</th>
                    <th>Số Lượng</th>
                    <th>Tổng</th>
                    <th className='flex items-center gap-2 justify-start w-[85px]'>
                      <div>tất cả</div>
                      <input
                        className="h-4 w-4"
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartData?.products?.map((product, index) => (
                    <tr key={product.productId}>
                      <td>
                        <div className="shopping-cart__product-item">
                          <a href="product1_simple.html">
                            <img loading="lazy" src={product.image} width={120} height={120} />
                          </a>
                        </div>
                      </td>
                      <td>
                        <div className="shopping-cart__product-item__detail">
                          <h4><a href="product1_simple.html">{product.name}</a></h4>
                          <ul className="shopping-cart__product-item__options">
                            <li>Color: {product.color || 'Không có'}</li>
                            <li>Size: {product.size || 'Không có'}</li>
                          </ul>
                        </div>
                      </td>
                      <td>
                        <span className="shopping-cart__product-price"><CurrencyVND amount={productPrice(index)} /></span>
                      </td>
                      <td>
                        <div className="qty-control position-relative">
                          <input type="number" name="quantity" value={quantities[index] || product.quantity}
                            onChange={e =>
                              handleQuantityChange(index, e.target.value)
                            } defaultValue={3} min={1} className="qty-control__number text-center" />
                          <div className="qty-control__reduce" onClick={() => decrementQuantity(index)}>-</div>
                          <div className="qty-control__increase" onClick={() => incrementQuantity(index)}>+</div>
                        </div>{/* .qty-control */}
                      </td>
                      <td>
                        <span className="shopping-cart__subtotal w-36"><CurrencyVND
                          amount={
                            (quantities[index] || product.quantity) *
                            productPrice(index)
                          }
                        /></span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          className="h-4 w-4"
                          type="checkbox"
                          checked={selectedProducts[index] || false}
                          onChange={() => toggleSelectProduct(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 flex justify-end">
                <button className="btn btn-light " onClick={handleDeleteSelectedProducts}>Xóa</button>
                {/* <button className="btn btn-light">Chọn tất cả({cartData?.products?.length || 0})</button> */}
              </div>
            </div>
            <div className="shopping-cart__totals-wrapper">
              <div className="sticky-content">
                <div className="shopping-cart__totals">
                  <h3>Tổng Giỏ Hàng</h3>
                  <table className="cart-totals">
                    <tbody>
                      <tr className=''>
                        <th>Tổng thanh toán (VND):{' '}</th>
                        <div className='text-2xl'><CurrencyVND amount={totalSelectedPrice || '0'} /></div>
                      </tr>
                      <tr>
                        <th>Phí Vận chuyển</th>
                        <td>
                          <div className="">
                            <label className="form-check-label" htmlFor="free_shipping">{shippingMessageDisplay}</label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>Giảm giá</th>
                        <td><CurrencyVND amount={discountAmount} /></td>
                      </tr>
                      <tr>
                        <th>Tổng đơn hàng</th>
                        <td><CurrencyVND
                          amount={
                            totalAmount - discountAmount + calculatedShippingFee
                          }
                        /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mobile_fixed-btn_wrapper">
                  <div className="button-wrapper container">
                    <button className="btn btn-primary btn-checkout">PROCEED TO CHECKOUT</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="mb-5 pb-xl-5" />
    </div>

  );
}

export default Cart;
