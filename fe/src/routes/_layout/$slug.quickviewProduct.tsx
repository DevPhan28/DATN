import instance from '@/api/axiosIntance';
import CurrencyVND from '@/components/config/vnd';
import ProductRecommendations from '@/components/ProductRecommendations';
import { useCart } from '@/data/cart/useCartLogic';
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
        } catch (err) {}
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
  const userId = localStorage.getItem('userId');
  // const {
  //   handleQuantityChange,
  //   incrementQuantity,
  //   decrementQuantity,
  // } = useCart(userId);
  return (
    <div>
      <div>
        <main>
          <div className="mb-md-1 pb-md-3" />
          <section className="product-single container px-[55px]">
            <div className="row">
              <div className="col-lg-7">
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
                    <div className="mb-4">
                      <img
                        src={currentImage || product.image}
                        width={600}
                        height={300}
                        alt="Product"
                        className="rounded-lg bg-slate-400 object-cover shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="d-flex justify-content-between pb-md-2 mb-4">
                  <div className="breadcrumb d-none d-md-block flex-grow-1 mb-0">
                    <a
                      href="#"
                      className="menu-link menu-link_us-s text-uppercase fw-medium"
                    >
                      Home
                    </a>
                    <span className="breadcrumb-separator menu-link fw-medium pe-1 ps-1">
                      /
                    </span>
                    <a
                      href="#"
                      className="menu-link menu-link_us-s text-uppercase fw-medium"
                    >
                      The Shop
                    </a>
                  </div>
                  {/* /.breadcrumb */}
                  <div className="product-single__prev-next d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
                    <a href="#" className="text-uppercase fw-medium disabled">
                      <svg
                        className="mb-1px"
                        width={10}
                        height={10}
                        viewBox="0 0 25 25"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_prev_md" />
                      </svg>
                      <span className="menu-link menu-link_us-s">Prev</span>
                    </a>
                    <a
                      href="product2_variable.html"
                      className="text-uppercase fw-medium"
                    >
                      <span className="menu-link menu-link_us-s">Next</span>
                      <svg
                        className="mb-1px"
                        width={10}
                        height={10}
                        viewBox="0 0 25 25"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_next_md" />
                      </svg>
                    </a>
                  </div>
                  {/* /.shop-acs */}
                </div>
                <h1 className="product-single__name">{product.name}</h1>
                <div className="product-single__rating flex gap-2">
                  <div className="reviews-group d-flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <StarSolid
                        key={index}
                        className={`h-5 w-5 ${index < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="font-semibold">
                      {averageRating.toFixed(1)} trên tổng {comments.length}{' '}
                      Bình luận
                    </span>
                  </div>
                </div>
                <div className="product-single__price">
                  <CurrencyVND amount={product.price} />
                </div>
                <div className="product-single__short-desc">
                  <p>{product.description}</p>
                </div>
                <form name="" method="" onSubmit={e => e.preventDefault()}>
                  <div className="product-single__swatches">
                    <div className="product-swatch text-swatches">
                      <label>Kích cỡ</label>
                      <div className="swatch-list">
                        {uniqueSizes.map(size => (
                          <button
                            type="button"
                            onClick={() => handleSizeChange(size)}
                            className={`rounded border px-4 py-2 ${
                              selectedSize === size
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <a
                        href="#"
                        className="sizeguide-link"
                        data-bs-toggle="modal"
                        data-bs-target="#sizeGuide"
                        onClick={e => e.preventDefault()}
                      >
                        Size Guide
                      </a>
                    </div>
                    <div className="product-swatch color-swatches h-10">
                      <label>Color</label>
                      <div className="swatch-list">
                        {availableColors &&
                          availableColors.map((color, index) => (
                            <button
                              type="button"
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`h-8 w-8 rounded-full border focus:outline-none ${
                                selectedColor === color
                                  ? 'border-blue-500 ring-2 ring-blue-500'
                                  : 'border-gray-300'
                              }`}
                              style={{
                                backgroundColor: color,
                                boxShadow:
                                  selectedColor === color
                                    ? '0 0 10px rgba(59, 130, 246, 0.7)'
                                    : 'none',
                              }}
                              disabled={!selectedSize}
                            ></button>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="product-single__addtocart">
                    <div className="qty-control position-relative">
                      <input
                        type="number"
                        name="quantity"
                        defaultValue={1}
                        min={1}
                        value={quantity}
                        readOnly
                        className="qty-control__number text-center"
                      />
                      <div
                        className="qty-control__reduce"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </div>
                      <div
                        className="qty-control__increase"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </div>
                    </div>
                    {/* .qty-control */}
                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault(); // Ngừng hành động mặc định của form
                        handleAddToCart(); // Gọi hàm thêm sản phẩm vào giỏ hàng
                      }}
                      disabled={addItemToCart.isLoading}
                      className="btn btn-primary btn-addtocart js-open-aside"
                      data-aside="cartDrawer"
                    >
                      {addItemToCart.isLoading
                        ? 'Đang thêm...'
                        : 'Thêm vào giỏ hàng'}
                    </button>
                    {/* js-open-aside */}
                  </div>
                </form>

                <div className="product-single__addtolinks">
                  <a
                    href="#"
                    className="menu-link menu-link_us-s add-to-wishlist"
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href="#icon_heart" />
                    </svg>
                    <span>Add to Wishlist</span>
                  </a>
                  <share-button className="share-button">
                    <button className="menu-link menu-link_us-s to-share d-flex align-items-center border-0 bg-transparent">
                      <svg
                        width={16}
                        height={19}
                        viewBox="0 0 16 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_sharing" />
                      </svg>
                      <span>Share</span>
                    </button>
                    <details
                      id="Details-share-template__main"
                      className="m-1 xl:m-1.5"
                      hidden
                    >
                      <summary className="btn-solid m-1 px-5 pb-3 pt-3.5 xl:m-1.5">
                        +
                      </summary>
                      <div
                        id="Article-share-template__main"
                        className="share-button__fallback bg-container shadow-theme absolute left-0 top-full z-10 flex w-full items-center border-t px-2 py-4"
                      >
                        <div className="field mr-4 grow">
                          <label className="field__label sr-only" htmlFor="url">
                            Link
                          </label>
                          <input
                            type="text"
                            className="field__input w-full"
                            id="url"
                            defaultValue="https://uomo-crystal.myshopify.com/blogs/news/go-to-wellness-tips-for-mental-health"
                            placeholder="Link"
                            onclick="this.select();"
                            readOnly
                          />
                        </div>
                        <button className="share-button__copy no-js-hidden">
                          <svg
                            className="icon icon-clipboard mr-1 inline-block"
                            width={11}
                            height={13}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            focusable="false"
                            viewBox="0 0 11 13"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2 1a1 1 0 011-1h7a1 1 0 011 1v9a1 1 0 01-1 1V1H2zM1 2a1 1 0 00-1 1v9a1 1 0 001 1h7a1 1 0 001-1V3a1 1 0 00-1-1H1zm0 10V3h7v9H1z"
                              fill="currentColor"
                            />
                          </svg>
                          <span className="sr-only">Copy link</span>
                        </button>
                      </div>
                    </details>
                  </share-button>
                </div>
                <div className="product-single__meta-info">
                  <div className="meta-item">
                    <label>SKU:</label>
                    <span>N/A</span>
                  </div>
                  <div className="meta-item">
                    <label>Categories:</label>
                    <span>Casual &amp; Urban Wear, Jackets, Men</span>
                  </div>
                  <div className="meta-item">
                    <label>Tags:</label>
                    <span>biker, black, bomber, leather</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-single__details-tab">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link nav-link_underscore active"
                    id="tab-description-tab"
                    data-bs-toggle="tab"
                    href="#tab-description"
                    role="tab"
                    aria-controls="tab-description"
                    aria-selected="true"
                  >
                    Description
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link nav-link_underscore"
                    id="tab-additional-info-tab"
                    data-bs-toggle="tab"
                    href="#tab-additional-info"
                    role="tab"
                    aria-controls="tab-additional-info"
                    aria-selected="false"
                  >
                    Additional Information
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link nav-link_underscore"
                    id="tab-reviews-tab"
                    data-bs-toggle="tab"
                    href="#tab-reviews"
                    role="tab"
                    aria-controls="tab-reviews"
                    aria-selected="false"
                  >
                    Reviews (2)
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="tab-description"
                  role="tabpanel"
                  aria-labelledby="tab-description-tab"
                >
                  <div className="product-single__description">
                    <h3 className="block-title mb-4">
                      Sed do eiusmod tempor incididunt ut labore
                    </h3>
                    <p className="content">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum. Sed ut
                      perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium doloremque laudantium, totam rem aperiam,
                      eaque ipsa quae ab illo inventore veritatis et quasi
                      architecto beatae vitae dicta sunt explicabo.
                    </p>
                    <div className="row">
                      <div className="col-lg-6">
                        <h3 className="block-title">Why choose product?</h3>
                        <ul className="list text-list">
                          <li>Creat by cotton fibric with soft and smooth</li>
                          <li>
                            Simple, Configurable (e.g. size, color, etc.),
                            bundled
                          </li>
                          <li>
                            Downloadable/Digital Products, Virtual Products
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-6">
                        <h3 className="block-title">Sample Number List</h3>
                        <ol className="list text-list">
                          <li>Create Store-specific attrittbutes on the fly</li>
                          <li>
                            Simple, Configurable (e.g. size, color, etc.),
                            bundled
                          </li>
                          <li>
                            Downloadable/Digital Products, Virtual Products
                          </li>
                        </ol>
                      </div>
                    </div>
                    <h3 className="block-title mb-0">Lining</h3>
                    <p className="content">
                      100% Polyester, Main: 100% Polyester.
                    </p>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="tab-additional-info"
                  role="tabpanel"
                  aria-labelledby="tab-additional-info-tab"
                >
                  <div className="product-single__addtional-info">
                    <div className="item">
                      <label className="h6">Weight</label>
                      <span>1.25 kg</span>
                    </div>
                    <div className="item">
                      <label className="h6">Dimensions</label>
                      <span>90 x 60 x 90 cm</span>
                    </div>
                    <div className="item">
                      <label className="h6">Size</label>
                      <span>XS, S, M, L, XL</span>
                    </div>
                    <div className="item">
                      <label className="h6">Color</label>
                      <span>Black, Orange, White</span>
                    </div>
                    <div className="item">
                      <label className="h6">Storage</label>
                      <span>Relaxed fit shirt-style dress with a rugged</span>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="tab-reviews"
                  role="tabpanel"
                  aria-labelledby="tab-reviews-tab"
                >
                  <h2 className="product-single__reviews-title">Reviews</h2>
                  <div className="product-single__reviews-list">
                    <div className="product-single__reviews-item">
                      <div className="customer-avatar">
                        <img loading="lazy" src="../images/avatar.jpg" alt />
                      </div>
                      <div className="customer-review">
                        <div className="customer-name">
                          <h6>Janice Miller</h6>
                          <div className="reviews-group d-flex">
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                          </div>
                        </div>
                        <div className="review-date">April 06, 2023</div>
                        <div className="review-text">
                          <p>
                            Nam libero tempore, cum soluta nobis est eligendi
                            optio cumque nihil impedit quo minus id quod maxime
                            placeat facere possimus, omnis voluptas assumenda
                            est…
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="product-single__reviews-item">
                      <div className="customer-avatar">
                        <img loading="lazy" src="../images/avatar.jpg" alt />
                      </div>
                      <div className="customer-review">
                        <div className="customer-name">
                          <h6>Benjam Porter</h6>
                          <div className="reviews-group d-flex">
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                            <svg
                              className="review-star"
                              viewBox="0 0 9 9"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_star" />
                            </svg>
                          </div>
                        </div>
                        <div className="review-date">April 06, 2023</div>
                        <div className="review-text">
                          <p>
                            Nam libero tempore, cum soluta nobis est eligendi
                            optio cumque nihil impedit quo minus id quod maxime
                            placeat facere possimus, omnis voluptas assumenda
                            est…
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="product-single__review-form">
                    <form name="customer-review-form">
                      <h5>Be the first to review “Message Cotton T-Shirt”</h5>
                      <p>
                        Your email address will not be published. Required
                        fields are marked *
                      </p>
                      <div className="select-star-rating">
                        <label>Your rating *</label>
                        <span className="star-rating">
                          <svg
                            className="star-rating__star-icon"
                            width={12}
                            height={12}
                            fill="#ccc"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z" />
                          </svg>
                          <svg
                            className="star-rating__star-icon"
                            width={12}
                            height={12}
                            fill="#ccc"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z" />
                          </svg>
                          <svg
                            className="star-rating__star-icon"
                            width={12}
                            height={12}
                            fill="#ccc"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z" />
                          </svg>
                          <svg
                            className="star-rating__star-icon"
                            width={12}
                            height={12}
                            fill="#ccc"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z" />
                          </svg>
                          <svg
                            className="star-rating__star-icon"
                            width={12}
                            height={12}
                            fill="#ccc"
                            viewBox="0 0 12 12"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.1429 5.04687C11.1429 4.84598 10.9286 4.76562 10.7679 4.73884L7.40625 4.25L5.89955 1.20312C5.83929 1.07589 5.72545 0.928571 5.57143 0.928571C5.41741 0.928571 5.30357 1.07589 5.2433 1.20312L3.73661 4.25L0.375 4.73884C0.207589 4.76562 0 4.84598 0 5.04687C0 5.16741 0.0870536 5.28125 0.167411 5.3683L2.60491 7.73884L2.02902 11.0871C2.02232 11.1339 2.01563 11.1741 2.01563 11.221C2.01563 11.3951 2.10268 11.5558 2.29688 11.5558C2.39063 11.5558 2.47768 11.5223 2.56473 11.4754L5.57143 9.89509L8.57813 11.4754C8.65848 11.5223 8.75223 11.5558 8.84598 11.5558C9.04018 11.5558 9.12054 11.3951 9.12054 11.221C9.12054 11.1741 9.12054 11.1339 9.11384 11.0871L8.53795 7.73884L10.9688 5.3683C11.0558 5.28125 11.1429 5.16741 11.1429 5.04687Z" />
                          </svg>
                        </span>
                        <input
                          type="hidden"
                          id="form-input-rating"
                          defaultValue
                        />
                      </div>
                      <div className="mb-4">
                        <textarea
                          id="form-input-review"
                          className="form-control form-control_gray"
                          placeholder="Your Review"
                          cols={30}
                          rows={8}
                          defaultValue={''}
                        />
                      </div>
                      <div className="form-label-fixed mb-4">
                        <label htmlFor="form-input-name" className="form-label">
                          Name *
                        </label>
                        <input
                          id="form-input-name"
                          className="form-control form-control-md form-control_gray"
                        />
                      </div>
                      <div className="form-label-fixed mb-4">
                        <label
                          htmlFor="form-input-email"
                          className="form-label"
                        >
                          Email address *
                        </label>
                        <input
                          id="form-input-email"
                          className="form-control form-control-md form-control_gray"
                        />
                      </div>
                      <div className="form-check mb-4">
                        <input
                          className="form-check-input form-check-input_fill"
                          type="checkbox"
                          defaultValue
                          id="remember_checkbox"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="remember_checkbox"
                        >
                          Save my name, email, and website in this browser for
                          the next time I comment.
                        </label>
                      </div>
                      <div className="form-action">
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <div className="pb-xl-5 mb-5" />
      </div>
    </div>
  );
}

export default DetailProduct;
