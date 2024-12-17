import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useSearch } from '@/data/products/useSearch';
import { ShoppingCartSolid, Heart } from '@medusajs/icons';
import useCartMutation from '@/data/cart/useCartMutation';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/searchList/')({
  component: SearchList,
});

function SearchList() {
  const [searchTerm, setSearchTerm] = useState(''); // Giá trị nhập vào
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [page, setPage] = useState(1); // Trang hiện tại
  const [isSearchOpen, setIsSearchOpen] = useState(true); // Trạng thái mở modal tìm kiếm

  const { addItemToCart } = useCartMutation();

  // Fetch dữ liệu tìm kiếm
  const { data, isLoading, isError, isFetching, isSuccess } = useSearch(
    submittedSearchTerm,
    10,
    page
  );

  const pagination = data?.meta || {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  };

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim().length < 2) {
      alert('Vui lòng tìm kiếm tối thiểu 2 kí tự!!');
      return;
    }

    if (searchTerm !== submittedSearchTerm) {
      setSubmittedSearchTerm(searchTerm); // Cập nhật từ khóa tìm kiếm
      setPage(1); // Reset về trang 1
    }
  };

  // Đóng modal sau khi tìm kiếm thành công và có dữ liệu
  useEffect(() => {
    if (isSuccess && data?.data.length > 0) {
      setIsSearchOpen(false);
    }
  }, [isSuccess, data]);

  // Xử lý sự kiện "Load More"
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="search-container mx-auto max-w-7xl p-5 sm:p-5 md:p-5 lg:p-10">
      {/* Modal tìm kiếm */}
      {isSearchOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
            {/* Nút đóng modal */}
           
           
                <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition"
            >
              <img
                src="https://themewagon.github.io/cozastore/images/icons/icon-close2.png"
                alt="Close"
                className="w-5 h-5"
              />
            </button>
          
            {/* Form tìm kiếm */}
            <form
              onSubmit={handleSearch}
              className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md shadow-sm"
            >
              <button className="p-2 text-gray-500 hover:text-gray-700 transition">
                <i className="fa-solid fa-magnifying-glass p-3 text-[20px] hover:text-blue-400"></i>
              </button>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm ngay..."
                className="w-full p-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              />
            </form>
          </div>
        </div>
      )}

      {/* Hiển thị kết quả tìm kiếm */}
      {isLoading || isFetching ? <p>Đang tải dữ liệu...</p> : null}

      {isError && (
        <p className="text-red-500">Đã có lỗi xảy ra khi tìm kiếm.</p>
      )}

      {submittedSearchTerm && (
        <>
          {isSuccess && data?.data.length > 0 ? (
            <>
              {/* Thêm tiêu đề "Sản phẩm đã tìm kiếm" */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-700">Sản phẩm đã tìm kiếm</h2>
                <p className="text-sm text-gray-500">
                  Kết quả tìm kiếm cho từ khóa: <span className="font-semibold">{submittedSearchTerm}</span>
                </p>
              </div>

              <div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                onClick={() => setIsSearchOpen(!isSearchOpen)} // Toggle isSearchOpen when clicking on the grid
              >
                {data.data.map((product: any) => (
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
                      to={`/${product.slug ? product.slug : product._id}/quickviewProduct`}
                      className="quick-view duration-900 absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-white px-4 py-2 opacity-0 shadow transition-all hover:bg-black hover:text-white group-hover:translate-y-[-100px] group-hover:opacity-100"
                    >
                      Xem nhanh
                    </Link>
                    <h2 className="mt-2 flex items-center justify-between text-gray-500">
                      {product.name}
                      <div className="flex space-x-2">
                        <Link
                          to={`/${product.slug ? product.slug : product._id}/detailproduct`}
                        >
                          <ShoppingCartSolid />
                        </Link>
                        <Heart />
                      </div>
                    </h2>
                    <p className="mt-2 flex justify-start text-gray-600">
                      ${product.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Button "Load More" */}
              {pagination.currentPage < pagination.totalPages && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                  >
                    Tải thêm
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>Không có sản phẩm nào phù hợp.</p>
          )}
        </>
      )}
    </div>
  );
}

export default SearchList;
