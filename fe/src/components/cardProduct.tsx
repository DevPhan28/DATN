import React, { useState } from 'react';
import {
  useFetchCategory,
  useFetchProductAll,
} from '@/data/products/useProductList';
import useCartMutation from '@/data/cart/useCartMutation';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Funnel,
  MagnifyingGlass,
  ShoppingCartSolid,
  Heart as HeartIcon, // Renaming Heart to avoid name conflict
} from '@medusajs/icons';
import FilterBar from './FilterBar';

// Định nghĩa kiểu dữ liệu cho sản phẩm
type Product = {
  slug: string;
  _id: string;
  name: string;
  price: number;
  image: string;
  category: { _id: string; name: string };
  variantId?: string;
};

const CardProduct: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Trạng thái cho từ khóa tìm kiếm

  const { addItemToCart } = useCartMutation();
  const navigate = useNavigate();

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    if (!showFilter) {
      setShowSearch(false); // Tắt Search khi Filter bật
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setShowFilter(false); // Tắt Filter khi Search bật
    }
  };

  const { listProduct, loading, error } = useFetchProductAll();
  const { data: categories } = useFetchCategory();

  const handleAddToCart = (product: Product) => {
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

  // Lọc sản phẩm theo danh mục
  const filteredProducts = selectedCategory
    ? listProduct.filter(product => product?.category?._id === selectedCategory)
    : listProduct;

  // Lọc thêm theo từ khóa tìm kiếm
  const searchFilteredProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProducts = searchFilteredProducts.slice(0, 8);

  // Toggle favorite function
  const toggleFavorite = (productId: string) => {
    setIsFavorite(prevState => !prevState);
    // You can add additional logic here, such as saving the favorite status in the backend or localStorage
  };

  return (
    <div className="m-auto mt-10 max-w-7xl p-5 sm:p-5 md:p-5 lg:p-5 xl:p-0">
      <h1 className="mb-4 text-2xl font-bold sm:mb-8 sm:text-4xl">
        PRODUCT OVERVIEW
      </h1>
      <div className="mb-4 flex flex-wrap items-center justify-between sm:mb-8">
        <div className="flex flex-wrap space-x-4 sm:space-x-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="border-b-2 border-gray-900 text-gray-900"
          >
            All Products
          </button>
          {categories?.map((category: { _id: string; name: string }) => (
            <a
              href="#"
              key={category._id}
              onClick={e => {
                e.preventDefault();
                setSelectedCategory(category._id);
              }}
              className={`border-gray-900 text-gray-600 hover:border-b-2 ${selectedCategory === category._id ? 'border-b-2' : ''}`}
            >
              {category.name}
            </a>
          ))}
        </div>
        <div className="mt-4 flex space-x-2 sm:mt-0 sm:space-x-4">
          <button
            onClick={toggleFilter}
            className="flex items-center rounded border border-gray-300 px-2 py-1 sm:px-4 sm:py-2"
          >
            <Funnel className="mr-1 sm:mr-2" />{' '}
            {showFilter ? 'Close' : 'Filter'}
          </button>
          <button
            onClick={toggleSearch}
            className="flex items-center rounded border border-gray-300 px-2 py-1 sm:px-4 sm:py-2"
          >
            <MagnifyingGlass className="mr-1 sm:mr-2" />{' '}
            {showSearch ? 'Close' : 'Search'}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-8 scale-100 transform opacity-100 transition-all duration-500 ease-in-out">
          <div className="flex items-center space-x-2 rounded-lg border border-gray-300 p-4">
            <MagnifyingGlass className="mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input w-full border-none bg-white focus:outline-none"
            />
          </div>
        </div>
      )}

      {showFilter && <FilterBar />}

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
          {displayedProducts.map((product: Product) => (
            <div key={product._id} className="product-card group relative overflow-hidden text-center">
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-full transform transition-transform duration-500"
              />
              <Link
                to={`${product.slug ? product.slug : product._id}/quickviewProduct`}
                className="quick-view duration-900 absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-white px-4 py-2 opacity-0 shadow transition-all hover:bg-black hover:text-white group-hover:translate-y-[-100px] group-hover:opacity-100"
              >
                View Details
              </Link>
              <h2 className="mt-2 flex items-center justify-between text-gray-500">
                {product.name}
                <div className="flex gap-1 space-x-2">
                  <Link
                    to={`/${product.slug ? product.slug : product._id}/detailproduct`}
                    className="hover:text-blue-300"
                  >
                    <ShoppingCartSolid />
                  </Link>
                  <button
                    onClick={() => toggleFavorite(product._id)}
                    className={`transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <HeartIcon />
                  </button>
                </div>
              </h2>
              <p className="mt-2 flex justify-start text-gray-600">
                ${product.price}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No products found.</p>
      )}

      <div className="m-auto max-w-6xl p-10 text-center">
        <button
          onClick={() => navigate({ to: '/shop' })}
          className="rounded-2xl border border-gray-300 bg-blue-500 px-6 py-2 hover:bg-black text-white"
        >
          Xem thêm
        </button>
      </div>
    </div>
  );
};

export default CardProduct;
