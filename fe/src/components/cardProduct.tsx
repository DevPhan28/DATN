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
  Heart,
  ShoppingCartSolid,
} from '@medusajs/icons';
import FilterBar from './FilterBar';

// Định nghĩa kiểu dữ liệu cho sản phẩm
type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: { _id: string; name: string };
  variantId?: string;
};

const CardProduct: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Thêm trạng thái để theo dõi danh mục được chọn
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
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
  const { data: categories } = useFetchCategory(); // Lấy danh mục từ API

  const handleAddToCart = (product: Product) => {
    const userId = localStorage.getItem('userId') ?? ''; // Xử lý userId có thể là null
    if (!userId) {
      console.error('User ID is missing');
      return; // Ngăn hành động nếu không có userId
    }

    addItemToCart.mutate({
      userId: userId,
      products: [
        {
          productId: product._id,
          variantId: product.variantId ?? '',
          quantity: 1,
        },
      ], // variantId được thêm nếu có
    });
  };

  const filteredProducts = selectedCategory
    ? listProduct.filter(product => product?.category?._id === selectedCategory)
    : listProduct; // Hiển thị tất cả sản phẩm nếu không chọn danh mục nào

  const displayedProducts = filteredProducts
    ? filteredProducts.slice(0, 8)
    : [];

  return (
    <div className="container mx-auto p-4 sm:p-8">
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
                setSelectedCategory(category._id); // Gọi hàm để cập nhật danh mục
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
              className="search-input w-full border-none bg-white focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Thanh lọc */}
      {showFilter && <FilterBar />}

      {/* Hiển thị trạng thái Loading hoặc Error */}
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Hiển thị danh sách sản phẩm */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
          {displayedProducts.map((product: Product) => (
            <div
              key={product._id}
              className="product-card group relative overflow-hidden text-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-full transform transition-transform duration-500"
              />
              <Link
                to={`${product._id}/detailproduct`}
                className="quick-view duration-900 absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-white px-4 py-2 opacity-0 shadow transition-all hover:bg-black hover:text-white group-hover:translate-y-[-100px] group-hover:opacity-100"
              >
                Quick View
              </Link>
              <h2 className="mt-2 flex items-center justify-between text-gray-500">
                {product.name}
                <div className="flex space-x-2">
                  <Heart />
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
          onClick={() => navigate({ to: '/shop' })} // Điều hướng đến trang đăng nhập
          className="rounded-2xl border border-gray-300 bg-gray-100 px-6 py-2 hover:bg-blue-400"
        >
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
};

export default CardProduct;
