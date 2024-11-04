import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  ChevronRightMini,
  StarSolid,
  ThumbUp,
  EllipsisHorizontal,
  CommandLine,
  RocketLaunch,
  ArrowUpRightOnBox,
} from '@medusajs/icons';
import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import ProductRecommendations from '@/components/ProductRecommendations';

export const Route = createFileRoute('/_layout/$slug/quickviewProduct')({
  component: DetailProduct,
});

function DetailProduct() {
  const [currentImage, setCurrentImage] = useState('');
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [availableColors, setAvailableColors] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const { slug } = useParams({ from: '/_layout/$slug/quickviewProduct' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch product information from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await instance.get(`/products/slug/${slug}`);
        if (response.data && response.data.product) {
          setProduct(response.data.product);
          setCurrentImage(response.data.product.image); // Set initial current image
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

  // Mutation to add item to cart
  const addItemToCart = useMutation({
    mutationFn: data => instance.post('/cart/add-to-cart', data),
    onSuccess: () => {
      toast.success('Đã thêm sản phẩm vào giỏ hàng', {
        description: 'Sản phẩm của bạn đã được thêm vào giỏ hàng thành công!',
        duration: 1000,
      });
      queryClient.invalidateQueries(['cart']);
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

  // Handle size change
  const handleSizeChange = e => {
    const size = e.target.value;
    setSelectedSize(size);
    setSelectedColor('');

    // Filter available colors based on selected size
    const availableColors = product.variants
      .filter(variant => variant.size === size)
      .map(variant => variant.color);

    setAvailableColors([...new Set(availableColors)]);
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Vui lòng chọn size và màu sắc!');
      return;
    }

    const variant = product.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );

    if (!variant) {
      toast.error('Không tìm thấy biến thể sản phẩm với size và màu đã chọn.');
      return;
    }

    if (quantity > variant.countInStock) {
      toast.error(
        `Số lượng vượt quá tồn kho. Chỉ còn lại ${variant.countInStock} sản phẩm.`
      );
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

  // Add this query
  const { data: categoryData } = useQuery({
    queryKey: ['category', product?.categoryId],
    queryFn: async () => {
      if (!product?.categoryId) return null;
      const response = await instance.get(`/categories/${product.categoryId}`);
      return response.data;
    },
    enabled: !!product?.categoryId
  });

  // Display loading or error if any
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  // Generate unique sizes from product variants
  const uniqueSizes = [
    ...new Set(product.variants.map(variant => variant.size)),
  ];

  return (
    <div>
      <div className="">
        <div className="main-content flex h-48 w-full flex-col items-center justify-center">
          <div className="text-content">
            <div className="text-center text-4xl font-semibold">Shop</div>
            <div className="link caption1 mt-3 flex items-center justify-center gap-1">
              <div className="flex items-center justify-center">
                <a href="/">Home</a>
                <ChevronRightMini />
              </div>
              <div className="flex items-center justify-center">
                <a href="/">Shop</a>
                <ChevronRightMini />
              </div>
              <div className="capitalize text-gray-500">
                <a href="#">Quick View</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-10">
        <div className="m-auto max-w-7xl p-5 sm:p-5 md:p-5 lg:p-5 xl:p-0">
          <div className="mt-5 flex flex-col justify-between bg-white p-5 shadow md:gap-48 lg:flex-row">
            <div className="flex flex-col gap-5 lg:flex-row">
              {/* Thumbnails section */}
              <div className="flex sm:flex-row md:flex-row lg:flex-col">
                <img
                  alt="Main Product"
                  className="h-20 w-28 cursor-pointer rounded-lg border border-white object-cover p-1 hover:border-black hover:opacity-75"
                  src={product.image}
                  onClick={() => setCurrentImage(product.image)}
                  onMouseEnter={() => setCurrentImage(product.image)}
                />
                {product.gallery &&
                  product.gallery.map((img, index) => (
                    <img
                      key={index}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-20 w-28 cursor-pointer rounded-lg border border-white object-cover p-1 hover:border-black hover:opacity-75"
                      src={img}
                      onClick={() => setCurrentImage(img)}
                      onMouseEnter={() => setCurrentImage(img)}
                    />
                  ))}
              </div>
              {/* Main product image */}
              <div className="sm:w-[22rem] md:w-[26rem] lg:mt-0 lg:w-[35rem]">
                <div className="mb-4 md:h-[300px] md:w-[500px] lg:h-[400px] lg:w-[600px]">
                  <img
                    src={currentImage || product.image}
                    alt="Product"
                    className="h-[500px] w-[600px] rounded-lg bg-slate-400 object-cover shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Product details and purchase section */}
            <div className="mt-6 lg:mt-0">
              <h2 className="mb-4 w-96 text-xl font-bold sm:text-2xl lg:text-3xl">
                {product.name}
              </h2>
              <p className="mb-2 text-sm text-gray-600 sm:text-base">
                SKU: {product.sku}
              </p>
              <div className="mb-4 text-lg font-semibold text-red-600 sm:text-xl lg:text-2xl">
                ${product.price}
                <span className="text-sm text-gray-400 line-through sm:text-base lg:text-lg">
                  $1199
                </span>
              </div>
              <div className="mb-4 text-lg sm:text-xl">
                <p>{product.description}</p>
              </div>

              {/* Size dropdown with unique sizes */}
              <div className="mb-4 flex items-center">
                <label className="w-20 text-gray-700">Size</label>
                <select
                  className="flex-1 rounded border border-gray-300 p-2"
                  value={selectedSize}
                  onChange={handleSizeChange}
                >
                  <option value="">Chọn size</option>
                  {uniqueSizes.map(size => (
                    <option key={size} value={size}>
                      {size}
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
                  disabled={!selectedSize}
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

              {/* Quantity and Add to Cart */}
              <div className="mb-4 flex items-center gap-5">
                <div>Quantity</div>
                <div>
                  <button
                    className="rounded border border-gray-300 p-2"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    className="mx-2 w-12 rounded border border-gray-300 p-2 text-center"
                    type="text"
                    min="1"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="rounded border border-gray-300 p-2"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <button
                className="mt-3 rounded-md bg-blue-500 px-5 py-2 text-sm text-white transition hover:bg-gray-800 sm:px-6 sm:py-3 sm:text-lg"
                onClick={handleAddToCart}
                disabled={addItemToCart.isLoading}
              >
                {addItemToCart.isLoading ? 'Đang thêm...' : 'ADD TO CART'}
              </button>

              {/* Shipping and return info */}
              <div className="mt-4 w-full bg-[#EEEEEE] p-4">
                <div className="flex gap-4">
                  <RocketLaunch className="mt-1.5 text-xl text-green-700" />
                  <div>
                    <div className="text-lg font-semibold">Free ship</div>
                    <div className="text-sm">Free standard ship</div>
                    <div className="text-sm">
                      Estimated delivery is October 30, 2024 - October 31, 2024.
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-4">
                  <ArrowUpRightOnBox className="mt-1.5 text-xl text-green-700" />
                  <div>
                    <div className="text-lg font-semibold">Return Policy</div>
                    <div className="text-sm">Learn more</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 shadow mt-10">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left side - Customer Reviews lg:w-1/2*/}
              <div className="mt-10 w-full ">
                <div className='w-full mt-5 flex justify-between'>
                  <h2 className='font-semibold text-[24px]'>Customer Reviews (500+)</h2>
                  <div className='font-normal text-[18px] flex items-center text-[#666666]'>
                    <div>See All</div>
                    <ChevronRightMini />
                  </div>
                </div>

                {/* Rating Section */}
                <div className="flex gap-2 mt-6 border h-20 p-2 bg-gray-50">
                  <h1 className='font-semibold text-[28px]'>4.8</h1>
                  <div className='flex mt-2'>
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-200' />
                  </div>
                  <div className="flex gap-2 self-center">
                    <button className='border p-2 bg-white'>ALL</button>
                    <button className='border p-2 bg-white'>5 stars (99)</button>
                    <button className='border p-2 bg-white'>4 stars (8)</button>
                    <button className='border p-2 bg-white'>2 stars (2)</button>
                    <button className='border p-2 bg-white'>1 stars (8)</button>
                  </div>
                </div>

                {/* Review 1 */}
                <div className='mt-5 border-b pb-5'>
                  <h3 className='font-semibold'>Anh Thư <span className='text-[#767676] font-light'>14 Jun, 2024</span></h3>
                  <div className='flex'>
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                  </div>
                  <p className='mt-1'>Áo đẹp, chất lượng ổn áp, mình m72 nặng 58kg mặc size M nhe.</p>
                  <div className="mt-10 flex gap-2 justify-end text-[#767676]">
                    <ThumbUp className='text-black' />
                    Hữu ích(2)
                    <EllipsisHorizontal className='text-black' />
                  </div>
                </div>

                {/* Review 2 */}
                <div className='mt-5 border-b pb-5'>
                  <h3 className='font-semibold'>Anh Thư <span className='text-[#767676] font-light'>14 Jun, 2024</span></h3>
                  <div className='flex'>
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                    <StarSolid className='text-orange-300' />
                  </div>
                  <p className='mt-1'>Áo đẹp, chất lượng ổn áp, mình m72 nặng 58kg mặc size M nhe.</p>
                  <div className="mt-10 flex gap-2 justify-end text-[#767676]">
                    <ThumbUp className='text-black' />
                    Hữu ích(2)
                    <EllipsisHorizontal className='text-black' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductRecommendations categoryId={categoryData?.category?._id || ''} />
    </div>
  );
}

export default DetailProduct;
