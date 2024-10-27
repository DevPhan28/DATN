// src/hooks/useProductDetail.ts
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';

export function useProductDetail() {
  const { slug } = useParams({ from: '/_layout/$slug/detailproduct' }); // Lấy slug từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  // Lấy thông tin sản phẩm từ API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await instance.get(`/products/${slug}`);
        if (response.data && response.data.product) {
          setProduct(response.data.product);
        } else {
          throw new Error('Dữ liệu sản phẩm không có');
        }
      } catch (err) {
        setError('Có lỗi khi lấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Mutation để thêm sản phẩm vào giỏ hàng
  const addItemToCart = useMutation({
    mutationFn: (data: any) => instance.post('/cart/add-to-cart', data),
    onSuccess: () => {
      toast.success('Đã thêm sản phẩm vào giỏ hàng', {
        description: 'Sản phẩm của bạn đã được thêm vào giỏ hàng thành công!',
        duration: 1000,
      });
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error: any) => {
      if (error.response) {
        toast.error(
          `Có lỗi xảy ra: ${error.response.data.message || 'Lỗi không xác định'}`,
          {
            description: 'Không thể thêm sản phẩm vào giỏ hàng, vui lòng thử lại.',
            duration: 1000,
          }
        );
      } else {
        toast.error('Lỗi kết nối, vui lòng thử lại sau.');
      }
    },
  });

  // Xử lý khi người dùng chọn size
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setSelectedSize(size);
    setSelectedColor('');
    const availableColors = product?.variants
      .filter((variant: any) => variant.size === size)
      .map((variant: any) => variant.color);

    setAvailableColors([...new Set(availableColors)]);
  };

  // Xử lý khi người dùng bấm nút thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Vui lòng chọn size và màu sắc!');
      return;
    }

    const variant = product?.variants.find(
      (v: any) => v.size === selectedSize && v.color === selectedColor
    );

    if (!variant) {
      toast.error('Không tìm thấy biến thể sản phẩm với size và màu đã chọn.');
      return;
    }

    if (quantity > variant.countInStock) {
      toast.error(`Số lượng vượt quá tồn kho. Chỉ còn lại ${variant.countInStock} sản phẩm.`);
      return;
    }

    if (!product?._id || !variant.sku || !product.price || quantity < 1) {
      toast.error('Dữ liệu sản phẩm không hợp lệ, vui lòng kiểm tra lại.');
      return;
    }

    addItemToCart.mutate({
      userId: localStorage.getItem('userId'),
      products: [
        {
          productId: product._id,
          variantId: variant.sku,
          quantity,
          priceAtTime: product.price,
        },
      ],
    });
  };

  return {
    product,
    loading,
    error,
    selectedSize,
    selectedColor,
    availableColors,
    quantity,
    setQuantity,
    setSelectedColor,
    handleSizeChange,
    handleAddToCart,
    navigate, // Để điều hướng khi cần thiết
  };
}
