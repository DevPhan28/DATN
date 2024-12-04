import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSearch } from "@/data/products/useSearch";
import { ShoppingCartSolid, Heart } from '@medusajs/icons';
import useCartMutation from '@/data/cart/useCartMutation';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute("/_layout/searchList/")({
  component: SearchList,
});

function SearchList() {
  const [searchTerm, setSearchTerm] = useState(""); // Holds the input value
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(""); // For actual search
  const [page, setPage] = useState(1); // Current page number
  const { addItemToCart } = useCartMutation();

  // Fetch data based on search term and page number
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

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length < 2) {
      alert("Please enter at least 2 characters to search.");
      return;
    }
    setSubmittedSearchTerm(searchTerm); // Update search term
    setPage(1); // Reset page to 1
  };

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const handleAddToCart = (product: Product) => {
    const userId = localStorage.getItem('userId') ?? ''; // Handle userId
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

  return (
    <div className="search-container max-w-7xl mx-auto p-5 sm:p-5 md:p-5 lg:p-10">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex items-center space-x-3 mb-6">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search now..."
    className="border p-3 w-full text-sm placeholder-gray-400 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
  />
  <button
    type="submit"
    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-300"
  >
    Search
  </button>
</form>


      {isLoading || isFetching ? <p>Đang tải dữ liệu...</p> : null}

      {isError && <p className="text-red-500">Đã có lỗi xảy ra khi tìm kiếm.</p>}

      {submittedSearchTerm && (
        <>
          {isSuccess && data?.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((product : any) => (
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
                    Quick View
                  </Link>
                  <h2 className="mt-2 flex items-center justify-between text-gray-500">
                    {product.name}
                    <div className="flex space-x-2">
                      <Link to={`/${product.slug ? product.slug : product._id}/detailproduct`}>
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
          ) : (
            <p>Không có sản phẩm nào phù hợp.</p>
          )}
        </>
      )}
    </div>
  );
}

export default SearchList;
