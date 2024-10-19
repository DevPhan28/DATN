import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { useFetchCategory, useFetchProductAll } from "@/data/products/useProductList";
import useCartMutation from "@/data/cart/useCartMutation";
import { Link } from "@tanstack/react-router";
import { Funnel, MagnifyingGlass, Heart, ShoppingCartSolid } from "@medusajs/icons";
import FilterBar from '@/components/FilterBar';
export const Route = createFileRoute('/_layout/shop')({
  component: Shop
})

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Thêm trạng thái để theo dõi danh mục được chọn
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const { addItemToCart } = useCartMutation();

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
          products: [{ productId: product._id, variantId: product.variantId ?? '', quantity: 1 }], // variantId được thêm nếu có
      });
  };

  const filteredProducts = selectedCategory
      ? listProduct.filter((product) => product?.category?._id === selectedCategory)
      : listProduct; // Hiển thị tất cả sản phẩm nếu không chọn danh mục nào

  const displayedProducts = filteredProducts ? filteredProducts.slice(0, 16) : [];

  return (
      <div className="container mx-auto p-4 sm:p-8">
          <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-8">
              <div className="flex flex-wrap space-x-4 sm:space-x-8">
                  <button onClick={() => setSelectedCategory(null)} className="text-gray-900 border-b-2 border-gray-900">
                      All Products
                  </button>
                  {categories?.map((category: { _id: string; name: string }) => (
                      <a
                          href="#"
                          key={category._id}
                          onClick={(e) => {
                              e.preventDefault();
                              setSelectedCategory(category._id); // Gọi hàm để cập nhật danh mục
                          }}
                          className={`text-gray-600 border-gray-900 hover:border-b-2 ${selectedCategory === category._id ? 'border-b-2' : ''}`}
                      >
                          {category.name}
                      </a>
                  ))}
              </div>
              <div className="flex space-x-2 sm:space-x-4 mt-4 sm:mt-0">
                  <button
                      onClick={toggleFilter}
                      className="flex items-center border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 rounded"
                  >
                      <Funnel className="mr-1 sm:mr-2" /> {showFilter ? "Close" : "Filter"}
                  </button>
                  <button
                      onClick={toggleSearch}
                      className="flex items-center border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 rounded"
                  >
                      <MagnifyingGlass className="mr-1 sm:mr-2" /> {showSearch ? "Close" : "Search"}
                  </button>
              </div>
          </div>

          {showSearch && (
              <div className="mb-8 transition-all duration-500 ease-in-out transform scale-100 opacity-100">
                  <div className="border border-gray-300 p-4 rounded-lg flex items-center space-x-2">
                      <MagnifyingGlass className="mr-2" />
                      <input
                          type="text"
                          placeholder="Search"
                          className="w-full border-none focus:outline-none search-input bg-white"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                  {displayedProducts.map((product: Product) => (
                      <div key={product._id} className="text-center product-card relative group overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-80 transform transition-transform duration-500" />
                          <Link to={`${product._id}/detailproduct`} className="quick-view absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow opacity-0 transition-all duration-900 group-hover:opacity-100 group-hover:translate-y-[-100px] hover:bg-black hover:text-white">
                              Quick View
                          </Link>
                          <h2 className="mt-2 text-gray-500 flex justify-between items-center">
                              {product.name}
                              <div className="flex space-x-2">
                                  <Heart />
                              </div>
                          </h2>
                          <p className="text-gray-600 flex justify-start mt-2">${product.price}</p>
                      </div>
                  ))}
              </div>
          ) : (
              !loading && <p>No products found.</p>
          )}
      </div>
  );

}