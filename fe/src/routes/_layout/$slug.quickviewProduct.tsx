import instance from '@/api/axiosIntance';
import CurrencyVND from '@/components/config/vnd';
import ProductRecommendations from '@/components/ProductRecommendations';
import useCommentMutation from '@/data/Comment/useCommentMutation';
import { useSocket } from '@/data/socket/useSocket';
import {
  ChevronRightMini,
  EllipsisHorizontal,
  StarSolid,
  ThumbUp,
  Trash,
} from '@medusajs/icons';
import { DropdownMenu, IconButton, toast } from '@medusajs/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_layout/$slug/quickviewProduct')({
  component: DetailProduct,
});

function DetailProduct() {
  const [currentImage, setCurrentImage] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [availableColors, setAvailableColors] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { createComment, removeComment } = useCommentMutation();
  const [rating, setRating] = useState(0); // State for product rating
  const [averageRating, setAverageRating] = useState(0);

  const { slug } = useParams({ from: '/_layout/$slug/quickviewProduct' });
  const queryClient = useQueryClient();
  const socket = useSocket();  
  // Fetch product information from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await instance.get(`/products/slug/${slug}`);
        if (response.data && response.data.product) {
          setProduct(response.data.product);
          setCurrentImage(response.data.product.image);
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
  
    const handleCartUpdate = async () => {
      // Tải lại dữ liệu sản phẩm ngay khi có sự kiện
      await fetchProduct();
    };
  
    socket.on('update-cart', handleCartUpdate);
  
    // Hủy đăng ký khi component unmount hoặc slug thay đổi
    return () => {
      socket.off('update-cart', handleCartUpdate);
    };
  }, [slug]);
  
  
  
  useEffect(() => {
    if (product) {
      const fetchComments = async () => {
        try {
          const response = await instance.get(
            `/comments/product/${product._id}`
          );
          setComments(response.data);
          const totalRating = response.data.reduce(
            (sum, comment) => sum + comment.rating,
            0
          );
          const average = totalRating / response.data.length;
          setAverageRating(average); // Cập nhật số sao trung bình
        } catch (err) { }
      };
      fetchComments();
    }
  }, [product]);
  useEffect(() => {
    if (window.location.hash === '#comments-section') {
      const commentsSection = document.getElementById('comments-section');
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [slug]); // Ensure this effect runs when the component mounts

  useEffect(() => {
    if (window.location.hash === '#comments-section') {
      const commentTextarea = document.querySelector('textarea');
      if (commentTextarea) {
        commentTextarea.focus(); // Focus the textarea
      }
    }
  }, [product]); // Trigger when product data is available
  // console.log(localStorage.getItem('userId'));
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập bình luận.');
      return;
    }

    if (rating === 0) {
      toast.error('Vui lòng chọn đánh giá sao.');
      return;
    }

    try {
      // Call createComment mutation with rating
      createComment.mutate({
        productId: product._id,
        content: newComment,
        userId: localStorage.getItem('userId') || '', // Ensure userId is available
        rating: rating, // Pass the rating value
      });

      // Reset input and rating
      setNewComment('');
      setRating(0);
    } catch (err) {
      toast.error('Không thể gửi bình luận. Vui lòng thử lại.');
    }
  };

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

  // // Handle size change
  // const handleSizeChange = e => {
  //   const size = e.target.value;
  //   setSelectedSize(size);
  //   setSelectedColor('');

  //   // Filter available colors based on selected size
  //   const availableColors = product.variants
  //     .filter(variant => variant.size === size)
  //     .map(variant => variant.color);

  //   setAvailableColors([...new Set(availableColors)]);
  // };
  const handleSizeChange = size => {
    setSelectedSize(size); // Cập nhật kích cỡ được chọn
    setSelectedColor(''); // Reset màu khi thay đổi kích cỡ

    // Lọc danh sách màu sắc có sẵn dựa trên kích cỡ đã chọn
    const availableColors = product.variants
      .filter(variant => variant.size === size)
      .map(variant => variant.color);

    setAvailableColors([...new Set(availableColors)]); // Loại bỏ trùng lặp
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
  const handleDeleteComment = (commentId: string) => {
    removeComment.mutate(commentId);
  };
  const handleRatingChange = (newRating: number) => {
    setRating(newRating); // Update the rating value
  };
  // Add this query
  const { data: categoryData } = useQuery({
    queryKey: ['category', product?.categoryId],
    queryFn: async () => {
      if (!product?.categoryId) return null;
      const response = await instance.get(`/categories/${product.categoryId}`);
      return response.data;
    },
    enabled: !!product?.categoryId,
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
            <div className="text-center text-4xl font-semibold">Cửa hàng</div>
            <div className="link caption1 mt-3 flex items-center justify-center gap-1">
              <div className="flex items-center justify-center">
                <a href="/">Trang chủ</a>
                <ChevronRightMini />
              </div>
              <div className="flex items-center justify-center">
                <a href="/shop">Cửa hàng</a>
                <ChevronRightMini />
              </div>
              <div className="capitalize text-gray-500">
                <a href="#">Chi tiết</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-10">
        <div>{/* Hiển thị số sao trung bình */}</div>
        <div className="m-auto max-w-7xl p-5 sm:p-5 md:p-5 lg:p-5 xl:p-0">
          <div className="mt-5 flex flex-col justify-between bg-white p-5 shadow  lg:flex-row">
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
              <div className="">
                <div className="mb-4 md:h-[300px] md:w-[500px] lg:h-[500px] lg:w-[400px]">
                  <img
                    src={currentImage || product.image}
                    alt="Product"
                    className="h-[500px] w-[600px] rounded-lg bg-slate-400 object-cover shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Product details and purchase section */}
            <div className="mt-6 lg:mt-0 w-[580px]">
              <h2 className="mb-4 w-96 text-xl font-bold sm:text-2xl lg:text-3xl">
                {product.name}
              </h2>{' '}
              <div className="rating">
                <div className="mt-1 flex items-center">
                  {/* Hiển thị sao trung bình */}
                  {[...Array(5)].map((_, index) => (
                    <StarSolid
                      key={index}
                      className={`h-5 w-5 ${index < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="font-semibold">
                    {averageRating.toFixed(1)} trên tổng {comments.length} Bình
                    luận
                  </span>
                </div>
              </div>
              <p className="mb-2 text-sm text-gray-600 sm:text-base">
                Mã sản phẩm: {product.sku}
              </p>
              <div className="mb-4 text-lg font-semibold text-red-600 sm:text-xl lg:text-2xl">
                <CurrencyVND amount={product.price} />
              </div>
              <div className="mb-4 text-lg sm:text-xl">
                <p>{product.description}</p>
              </div>
              {/* Size selection with boxes */}
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Kích cỡ</label>
                <div className="flex gap-2">
                  {uniqueSizes.map(size => (
                    <button
                      onClick={() => handleSizeChange(size)}
                      className={`px-4 py-2 border rounded ${selectedSize === size
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                      {size}
                    </button>

                  ))}
                </div>
              </div>


              {/* Color selection with color circles */}
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">Màu</label>
                <div className="flex gap-2">
                  {availableColors &&
                    availableColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border ${selectedColor === color
                          ? 'border-blue-500 ring-2 ring-blue-300'
                          : 'border-gray-300'
                          }`}
                        style={{ backgroundColor: color }}
                        disabled={!selectedSize}
                      ></button>
                    ))}
                </div>
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
                {addItemToCart.isLoading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </button>
            </div>
          </div>
          <div className="mx-auto mt-10 bg-white p-8 shadow">
            <h2 className="text-2xl font-semibold">Mô tả chi tiết</h2>
            <div
              className="mt-5"
              dangerouslySetInnerHTML={{ __html: product.detaildescription }}
            />
          </div>
          <div className="mt-10 bg-white p-4 shadow">
            <div className="flex flex-col gap-10 lg:flex-row">
              {/* Left side - Customer Reviews lg:w-1/2*/}

              <div className="w-full">
                <div className="mt-5 flex w-full justify-between">
                  <h2 className="text-[24px] font-semibold">
                    Đánh Giá Sản Phẩm (
                    {comments.length > 0 ? comments.length : 0})
                  </h2>
                  <div className="flex items-center text-[18px] font-normal text-[#666666]">
                    <div>See All</div>
                    <ChevronRightMini />
                  </div>
                </div>

                <div id="comments-section">
                  <h2 className="text-2xl">Bình luận</h2>
                  <textarea
                    className="mt-5 w-full rounded border p-3"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <StarSolid
                        key={star}
                        className={`cursor-pointer ${rating >= star ? 'text-orange-300' : 'text-orange-200'}`}
                        onClick={() => handleRatingChange(star)}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleCommentSubmit}
                    className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
                  >
                    Đăng bình luận
                  </button>
                  <div className="mt-5 pb-5">
                    {comments.length > 0 ? (
                      comments.map(comment => (
                        <div key={comment._id} className="mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={comment.userId?.avatar}
                              alt="User Avatar"
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {comment.userId?.username}
                              </h3>
                              <div className="flex">
                                {/* Đoạn này sẽ hiển thị sao dựa trên rating của comment */}
                                {[1, 2, 3, 4, 5].map(star => (
                                  <div key={star}>
                                    {comment.rating >= star ? (
                                      <StarSolid className="text-orange-300" />
                                    ) : (
                                      <StarSolid className="text-orange-200" />
                                    )}
                                  </div>
                                ))}
                              </div>

                              <p className="mt-1">{comment.commentText}</p>
                              <small>
                                {new Date(comment.createdAt).toLocaleString(
                                  'vi-VN',
                                  {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}
                              </small>
                            </div>
                          </div>
                          <div className="mt-10 flex justify-end gap-2 text-[#767676]">
                            <ThumbUp className="text-black" />
                            Hữu ích
                            <DropdownMenu>
                              <DropdownMenu.Trigger asChild>
                                <IconButton>
                                  <EllipsisHorizontal />
                                </IconButton>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Content>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item
                                  className="gap-x-2"
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                >
                                  <Trash className="text-ui-fg-subtle" />
                                  Xóa bình luận
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu>
                          </div>
                          <div className="mt-5 border-b pb-5"></div>
                        </div>
                      ))
                    ) : (
                      <p>Chưa có bình luận nào</p>
                    )}
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
