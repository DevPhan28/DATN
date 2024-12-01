import useCartMutation from '@/data/cart/useCartMutation';
import { useFetchProductAll } from '@/data/products/useProductList';
import { Link } from '@tanstack/react-router';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const NextArrow = ({ onClick }: any) => (
  <div
    className="custom-arrow custom-next hover:bg-gray-300 transition-all p-2 rounded-full"
    onClick={onClick}
    style={{
      display: 'block',
      right: '-26px',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      fontSize: '24px',
    }}
  >
    <i className="fa-solid fa-chevron-right"></i>
  </div>
);

const PrevArrow = ({ onClick }: any) => (
  <div
    className="custom-arrow custom-prev hover:bg-gray-300 transition-all p-2 rounded-full"
    onClick={onClick}
    style={{
      display: 'block',
      left: '-26px',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      fontSize: '24px',
    }}
  >
    <i className="fa-solid fa-chevron-left"></i>
  </div>
);

const FeaturedProducts = () => {
  const { addItemToCart } = useCartMutation();
  const { listProduct, loading, error } = useFetchProductAll();

  const handleAddToCart = (product: any) => {
    const userId = localStorage.getItem('userId') ?? '';
    if (!userId) {
      console.error('User ID is missing');
      return;
    }
    addItemToCart.mutate({
      userId: userId,
      products: [
        {
          productId: product._id,
          variantId: product.variantId ?? '',
          quantity: 1,
        },
      ],
    });
  };

  const displayedProducts = listProduct || [];

  // Slider settings for continuous, smooth scroll
  const settings = {
    dots: false,  // Set this to false to remove the navigation dots
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    cssEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Adds a smooth easing effect
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <div className=" xl:p-0 lg:p-5 md:p-5 sm:p-5 relative">
      <div className="max-w-7xl m-auto">
        <h2 className="text-left text-4xl uppercase font-bold mb-5 relative">
          Featured Product
        </h2>
      </div>
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {displayedProducts.length > 0 ? (
        <Slider {...settings}>
          {displayedProducts.map((product: any) => (
            <div
              key={product._id}
              className=" group relative overflow-hidden text-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-full transform transition-transform duration-500 object-cover"
              />
              <Link
                to={`/${product.slug ? product.slug : product._id}/quickviewProduct`}
                className="quick-view duration-900 absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-blue-400 px-4 py-2 opacity-0 shadow transition-all hover:bg-black hover:text-white group-hover:translate-y-[-100px] group-hover:opacity-100"
              >
                Quick View
              </Link>
            </div>
          ))}
        </Slider>
      ) : (
        !loading && <p>No products found.</p>
      )}
    </div>
  );
};

export default FeaturedProducts;
