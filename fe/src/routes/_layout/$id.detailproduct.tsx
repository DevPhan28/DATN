import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';

export const Route = createFileRoute('/_layout/$id/detailproduct')({
  component: () => {
    const { id } = useParams({ from: '/_layout/$id/detailproduct' });
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm

    const queryClient = useQueryClient(); // Để invalidate query khi cần

    // Lấy thông tin sản phẩm từ API
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const response = await instance.get(`/products/${id}`);
          if (response.data && response.data.data) {
            setProduct(response.data.data);
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
    }, [id]);

    // Mutation thêm sản phẩm vào giỏ hàng
    const addItemToCart = useMutation({
      mutationFn: (data) => instance.post('/cart/add-to-cart', data), // Gọi API thêm vào giỏ hàng
      onSuccess: () => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng', {
          description: 'Sản phẩm của bạn đã được thêm vào giỏ hàng thành công!',
          duration: 2000,
        });
        queryClient.invalidateQueries(['cart']); // Invalidate query cart
      },
      onError: (error) => {
        // Xử lý lỗi khi thêm vào giỏ hàng
        if (error.response) {
          toast.error(`Có lỗi xảy ra: ${error.response.data.message || 'Lỗi không xác định'}`, {
            description: 'Không thể thêm sản phẩm vào giỏ hàng, vui lòng thử lại.',
            duration: 2000,
          });
        } else {
          toast.error('Lỗi kết nối, vui lòng thử lại sau.');
        }
      },
    });

    // Hàm xử lý khi người dùng bấm nút thêm vào giỏ hàng
    const handleAddToCart = () => {
      // Kiểm tra nếu người dùng chưa chọn size và màu sắc
      if (!selectedSize || !selectedColor) {
        toast.error('Vui lòng chọn size và màu sắc!');
        return;
      }

      // Tìm biến thể của sản phẩm dựa trên size và màu
      const variant = product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      );

      // Nếu không tìm thấy biến thể phù hợp
      if (!variant) {
        toast.error('Không tìm thấy biến thể sản phẩm với size và màu đã chọn.');
        return;
      }

      // Kiểm tra số lượng tồn kho
      if (quantity > variant.countInStock) {
        toast.error(`Số lượng vượt quá tồn kho. Chỉ còn lại ${variant.countInStock} sản phẩm.`);
        return;
      }

      // Kiểm tra dữ liệu productId, variantId, priceAtTime
      if (!product._id || !variant.sku || !product.price || quantity < 1) {
        toast.error('Dữ liệu sản phẩm không hợp lệ, vui lòng kiểm tra lại.');
        return;
      }

      // Thực hiện gọi API thêm sản phẩm vào giỏ hàng
      addItemToCart.mutate({
        userId: localStorage.getItem('userId'), // Thay bằng userId thực tế
        products: [
          {
            productId: product._id,
            variantId: variant.sku, // Biến thể đã được kiểm tra hợp lệ
            quantity,
            priceAtTime: product.price, // Thêm giá hiện tại của sản phẩm
          },
        ],
      });
    };

    // Hiển thị loading hoặc lỗi nếu có
    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Không tìm thấy sản phẩm</div>; // Thêm thông báo khi không tìm thấy sản phẩm

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col md:flex-row rounded-lg bg-white p-6 shadow-lg w-full max-w-7xl h-full">
          <div className="mr-4 flex flex-col items-center">
            {product.gallery && product.gallery.map((img, index) => (
              <img
                key={index}
                alt={`Thumbnail ${index + 1}`}
                className="mb-2 h-20 w-20 rounded-md"
                src={img}
              />
            ))}
          </div>
          <div className="flex flex-col items-center">
            <img
              alt="Hình sản phẩm chính"
              className="mb-4 h-auto w-96 rounded-md"
              src={product.image}
            />
          </div>
          <div className="ml-10 mt-4 md:mt-0 flex-1">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="mt-2 text-xl text-gray-700">${product.price}</p>
            <p className="mt-4 text-gray-600">{product.description}</p>
            <div className="mt-6">
              <div className="mb-4 flex items-center">
                <label className="w-20 text-gray-700">Size</label>
                <select
                  className="flex-1 rounded border border-gray-300 p-2"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Chọn size</option>
                  {product.variants && product.variants.map(variant => (
                    <option key={variant.sku} value={variant.size}>{variant.size}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <label className="w-20 text-gray-700">Color</label>
                <select
                  className="flex-1 rounded border border-gray-300 p-2"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="">Chọn màu</option>
                  {product.variants && product.variants.map(variant => (
                    <option key={variant.sku} value={variant.color}>{variant.color}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <button className="rounded border border-gray-300 p-2" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  className="mx-2 w-12 rounded border border-gray-300 p-2 text-center"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                />
                <button className="rounded border border-gray-300 p-2" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button
                className="w-full rounded bg-blue-500 p-3 text-white"
                onClick={handleAddToCart}
                disabled={addItemToCart.isLoading} // Disable nút khi đang thêm vào giỏ hàng
              >
                {addItemToCart.isLoading ? 'Đang thêm...' : 'THÊM VÀO GIỎ HÀNG'}
              </button>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <i className="far fa-heart text-gray-500"></i>
              <i className="fab fa-facebook text-gray-500"></i>
              <i className="fab fa-twitter text-gray-500"></i>
              <i className="fab fa-google-plus text-gray-500"></i>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
