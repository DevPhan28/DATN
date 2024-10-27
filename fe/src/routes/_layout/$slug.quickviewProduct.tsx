import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ChevronRightMini, StarSolid, ThumbUp, EllipsisHorizontal, CommandLine, RocketLaunch, ArrowUpRightOnBox } from '@medusajs/icons';
import instance from '@/api/axiosIntance';
import { toast } from '@medusajs/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/_layout/$slug/quickviewProduct')({
  component: DetailProduct,
});

function DetailProduct() {
  const [currentImage, setCurrentImage] = useState('');
  const [images, setImages] = useState([]);

  // Call API
  const { slug } = useParams({ from: '/_layout/$slug/quickviewProduct' });
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [availableColors, setAvailableColors] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const queryClient = useQueryClient();


  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await instance.get(`/products/${slug}`);
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
            description: 'Không thể thêm sản phẩm vào giỏ hàng, vui lòng thử lại.',
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
      toast.error(`Số lượng vượt quá tồn kho. Chỉ còn lại ${variant.countInStock} sản phẩm.`);
      return;
    }

    if (!product._id || !variant.sku || !product.price || quantity < 1) {
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

  // Display loading or error if any
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white max-w-6xl m-auto p-5 xl:p-0 lg:p-5 md:p-5 sm:p-5">
      <div className='mt-5 flex gap-2 items-center text-[#666666]'>
        <a href="#" className="hover:underline">Home</a>
        <ChevronRightMini />
        <a href="#" className="hover:underline">Shop</a>
        <ChevronRightMini />
        <a href="#">Quick view</a>
      </div>

      <div className="flex flex-col lg:flex-row justify-between mt-5">
        <div className="flex lg:flex-row gap-5">
          {/* Thumbnails section */}
          <div className="">
            <img
              alt="Main Product"
              className="w-28 h-20 p-1 object-cover rounded-lg cursor-pointer hover:opacity-75 border border-white hover:border-black"
              src={product.image} // Hình ảnh chính
              onClick={() => setCurrentImage(product.image)}
              onMouseEnter={() => setCurrentImage(product.image)} // Thay đổi khi hover
            />
            {product.gallery &&
              product.gallery.map((img, index) => (
                <img
                  key={index}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-28 h-20 p-1 object-cover rounded-lg cursor-pointer hover:opacity-75 border border-white hover:border-black"
                  src={img}
                  onClick={() => setCurrentImage(img)}
                  onMouseEnter={() => setCurrentImage(img)} // Thay đổi khi hover
                />
              ))}
          </div>
          {/* Main product image */}
          <div className="lg:w-[30rem] md:w-[26rem] sm:w-[22rem] lg:mt-0">
            <div className="mb-4 h-[500px] w-[500px]">
              <img
                src={currentImage || product.image} // Hiển thị ảnh chính từ currentImage
                alt="Product"
                className="h-[500px] bg-slate-400 w-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>

          </div>
        </div>

        {/* Product details and purchase section */}
        <div className="  mt-6 lg:mt-0 flex-none">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            SKU: {product.sku}
          </p>
          <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-red-600 mb-4">
            ${product.price}
            <span className="text-sm sm:text-base lg:text-lg text-gray-400 line-through">$1199</span>
          </div>
          <div className="text-lg sm:text-xl mb-4">
            <p>{product.description}</p>
          </div>

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
          {/* Review section */}
          <div className="text-red-400 flex gap-2">
            <ThumbUp />91%
            <div className="text-[#767676] flex items-center gap-2">
              <div>The customer said it was true to size</div>
              <ChevronRightMini />
            </div>
          </div>
          {/* Size guide section */}
          <div className="flex gap-2 text-[#767676] mt-2">
            <CommandLine className="text-blue-400" />
            <div>Size guide</div>
          </div>
          {/* Add to cart button */}
          <button
            className="bg-blue-500 text-white py-2 sm:py-3 px-5 mt-3 sm:px-6 rounded-md text-sm sm:text-lg hover:bg-gray-800 transition"
            onClick={handleAddToCart}
            disabled={addItemToCart.isLoading} // Disable nút khi đang thêm vào giỏ hàng
          >
            {addItemToCart.isLoading
              ? 'Đang thêm...'
              : 'ADD TO CART'}
          </button>
          {/* Shipping and return info */}
          <div className="w-full p-4 bg-[#EEEEEE] mt-4">
            <div className="flex gap-4">
              <RocketLaunch className="text-green-700 text-xl mt-1.5" />
              <div>
                <div className="font-semibold text-lg">Free ship</div>
                <div className="text-sm">Free standard ship</div>
                <div className="text-sm">Estimated delivery is October 30, 2024 - October 31, 2024.</div>
              </div>
            </div>
            <div className="flex gap-4 mt-3">
              <ArrowUpRightOnBox className="text-green-700 text-xl mt-1.5" />
              <div>
                <div className="font-semibold text-lg">Return Policy</div>
                <div className="text-sm">Learn more</div>
              </div>
            </div>
          </div>

        </div>

      </div>
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
          <div className="flex gap-2 mt-6 border h-20 p-2 bg-gray-100">
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

        {/* <div className='mt-10 w-full lg:w-1/2'>
          <h2 className='font-semibold text-[24px]'>Customer Reviews (500+)</h2>
          <div className='font-normal text-[18px] flex items-center text-[#666666]'>
            <div>See All</div>
            <ChevronRightMini />
          </div>
        </div> */}
      </div>



      <div className='mt-5'>
        <h2 className='font-semibold text-[24px]'>Other products</h2>
      </div>
    </div>

  );
}

export default DetailProduct;
