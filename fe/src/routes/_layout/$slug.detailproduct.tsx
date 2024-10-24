import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';

export const Route = createFileRoute('/_layout/$slug/detailproduct')({
  // Đổi :id thành :slug
  component: () => {
    const { slug } = useParams({ from: '/_layout/$slug/detailproduct' }); // Lấy slug từ params
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [availableColors, setAvailableColors] = useState([]); // State để lưu danh sách màu
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm

    const queryClient = useQueryClient(); // Để invalidate query khi cần

    // Lấy thông tin sản phẩm từ API
    useEffect(() => {
      const fetchProduct = async () => {
        setLoading(true); // Bắt đầu loading
        try {
          // Sử dụng slug trong URL
          const response = await instance.get(`/products/${slug}`);
          if (response.data && response.data.product) {
            setProduct(response.data.product);
          } else {
            throw new Error('Dữ liệu sản phẩm không có');
          }
        } catch (err) {
          setError('Có lỗi khi lấy sản phẩm');
        } finally {
          setLoading(false); // Kết thúc loading
        }
      };

      fetchProduct();
    }, [slug]); // Chạy lại khi slug thay đổi

    // Mutation thêm sản phẩm vào giỏ hàng
    const addItemToCart = useMutation({
      mutationFn: data => instance.post('/cart/add-to-cart', data), // Gọi API thêm vào giỏ hàng
      onSuccess: () => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng', {
          description: 'Sản phẩm của bạn đã được thêm vào giỏ hàng thành công!',
          duration: 1000,
        });
        queryClient.invalidateQueries(['cart']); // Invalidate query cart
      },
      onError: error => {
        if (error.response) {
          toast.error(
            `Có lỗi xảy ra: ${error.response.data.message || 'Lỗi không xác định'}`,
            {
              description:
                'Không thể thêm sản phẩm vào giỏ hàng, vui lòng thử lại.',
              duration: 1000,
            }
          );
        } else {
          toast.error('Lỗi kết nối, vui lòng thử lại sau.');
        }
      },
    });

    // Xử lý khi người dùng chọn size
    const handleSizeChange = e => {
      const size = e.target.value;
      setSelectedSize(size);
      setSelectedColor(''); // Reset màu khi thay đổi size

      // Lọc các màu tương ứng với size đã chọn
      const availableColors = product.variants
        .filter(variant => variant.size === size)
        .map(variant => variant.color);

      // Cập nhật danh sách màu dựa trên size đã chọn
      setAvailableColors([...new Set(availableColors)]); // Loại bỏ màu trùng lặp
    };

    // Hàm xử lý khi người dùng bấm nút thêm vào giỏ hàng
    const handleAddToCart = () => {
      if (!selectedSize || !selectedColor) {
        toast.error('Vui lòng chọn size và màu sắc!');
        return;
      }

      const variant = product.variants.find(
        v => v.size === selectedSize && v.color === selectedColor
      );

      if (!variant) {
        toast.error(
          'Không tìm thấy biến thể sản phẩm với size và màu đã chọn.'
        );
        return;
      }

      if (quantity > variant.countInStock) {
        toast.error(
          `Số lượng vượt quá tồn kho. Chỉ còn lại ${variant.countInStock} sản phẩm.`
        );
        return;
      }

      if (!product._id || !variant.sku || !product.price || quantity < 1) {
        toast.error('Dữ liệu sản phẩm không hợp lệ, vui lòng kiểm tra lại.');
        return;
      }

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
    if (!product) return <div>Không tìm thấy sản phẩm</div>;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        {/* Overlay mờ */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => navigate({ to: '/' })} // Đóng modal khi click vào nền
        ></div>

        {/* Modal chi tiết sản phẩm */}
        <div className="relative z-50 w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
          {/* Nút đóng "X" */}
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
            onClick={() => navigate({ to: '/' })} // Điều hướng về trang chủ khi đóng modal
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex h-full flex-col md:flex-row">
            {/* Hiển thị hình ảnh sản phẩm */}
            <div className="mr-4 flex flex-col items-center">
              {product.gallery &&
                product.gallery.map((img, index) => (
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
                className="mb-4 h-96 w-96 rounded-md"
                src={product.image}
              />
            </div>
            {/* Chi tiết sản phẩm */}
            <div className="ml-10 mt-4 flex-1 md:mt-0">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="mt-2 text-xl text-gray-700">${product.price}</p>
              <p className="mt-4 text-gray-600">{product.description}</p>
              <div className="mt-6">
                <div className="mb-4 flex items-center">
                  <label className="w-20 text-gray-700">Size</label>
                  <select
                    className="flex-1 rounded border border-gray-300 p-2"
                    value={selectedSize}
                    onChange={handleSizeChange}
                  >
                    <option value="">Chọn size</option>
                    {product.variants &&
                      product.variants.map(variant => (
                        <option key={variant.sku} value={variant.size}>
                          {variant.size}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-4 flex items-center">
                  <label className="w-20 text-gray-700">Color</label>
                  <select
                    className="flex-1 rounded border border-gray-300 p-2"
                    value={selectedColor}
                    onChange={e => setSelectedColor(e.target.value)}
                    disabled={!selectedSize} // Disable nếu chưa chọn size
                  >
                    <option value="">Chọn màu</option>
                    {availableColors &&
                      availableColors.map((color, index) => (
                        <option key={index} value={color}>
                          {color}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-4 flex items-center">
                  <button
                    className="rounded border border-gray-300 p-2"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    className="mx-2 w-12 rounded border border-gray-300 p-2 text-center"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
                  />
                  <button
                    className="rounded border border-gray-300 p-2"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="w-full rounded bg-blue-500 p-3 text-white"
                  onClick={handleAddToCart}
                  disabled={addItemToCart.isLoading} // Disable nút khi đang thêm vào giỏ hàng
                >
                  {addItemToCart.isLoading
                    ? 'Đang thêm...'
                    : 'THÊM VÀO GIỎ HÀNG'}
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
      </div>
    );
  },
});
