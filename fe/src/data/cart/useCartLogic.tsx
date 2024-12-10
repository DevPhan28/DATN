import { useState } from 'react';
import useCartMutation from '@/data/cart/useCartMutation';
import { useFetchCart } from '@/data/cart/useFetchCart';
import { toast } from '@medusajs/ui';

export function useCart(userId: string | null) {
  const { data: cartData, isLoading } = useFetchCart(userId || '');
  const {
    deleteItemFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
  } = useCartMutation();

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [selectedProducts, setSelectedProducts] = useState<
    Record<number, boolean>
  >({});
  const [selectAll, setSelectAll] = useState(false);

  const handleQuantityChange = (index: number, value: string) => {
    const quantity = Math.max(parseInt(value) || 0, 0);
    setQuantities(prev => ({
      ...prev,
      [index]: quantity,
    }));
    const product = cartData?.products[index];
    if (product) {
      updateQuantity.mutate({
        userId: userId || '',
        productId: product.productId,
        variantId: product.variantId,
        quantity,
      });
    }
  };

  const incrementQuantity = (index: number) => {
    const product = cartData?.products[index];

    if (!product) {
      console.warn(`Product at index ${index} is undefined.`);
      return;
    }

    const currentQuantity = quantities[index] || product.quantity || 0;

    const newQuantity = currentQuantity + 1;

    setQuantities(prev => ({
      ...prev,
      [index]: newQuantity,
    }));
    increaseQuantity.mutate({
      userId: userId || '',
      productId: product.productId,
      variantId: product.variantId,
    });
  };

  const decrementQuantity = (index: number) => {
    const product = cartData?.products[index];
    const productQuantity = product?.quantity || 0;

    const newQuantity = Math.max((quantities[index] || productQuantity) - 1, 0);

    if (newQuantity === 0) {
      toast.error(`Có lỗi xảy ra`, {
        description: 'Không thể cập nhật số lượng về 0.',
        duration: 2000,
      });
    }

    setQuantities(prev => ({
      ...prev,
      [index]: newQuantity,
    }));

    if (product && newQuantity > 0) {
      decreaseQuantity.mutate({
        userId: userId || '',
        productId: product.productId,
        variantId: product.variantId,
      });
    }
  };

  const productPrice = (index: number): number => {
    const product = cartData?.products[index];
    const variantPrice = product?.priceAtTime ?? 0;
    return variantPrice > 0 ? variantPrice : product?.price || 0;
  };

  const handleDeleteSelectedProducts = () => {
    const selectedVariantIds = Object.keys(selectedProducts)
      .filter(index => selectedProducts[parseInt(index)])
      .map(index => cartData?.products[parseInt(index)]?.variantId)
      .filter((variantId): variantId is string => variantId !== undefined);

    if (selectedVariantIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để xóa.');
      return;
    }
    deleteItemFromCart.mutate(
      {
        userId: userId || '',
        variantIds: selectedVariantIds,
      },
      {
        onSuccess: () => {
          setSelectedProducts({});
          setSelectAll(false);
          toast.success('Đã xóa các sản phẩm đã chọn khỏi giỏ hàng.');
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.');
        },
      }
    );
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

  const totalSelectedPrice = cartData?.products.reduce(
    (sum, product, index) => {
      if (selectedProducts[index]) {
        return (
          sum + (quantities[index] || product.quantity) * productPrice(index)
        );
      }
      return sum;
    },
    0
  );

  const getSelectedItems = () => {
    return cartData?.products.filter((_, index) => selectedProducts[index]);
  };

  return {
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
  };
}
