import { useState } from 'react';
import { createFileRoute, useSearch as useSearchParams } from '@tanstack/react-router';
import { useSearch } from '@/data/products/useSearch';
import { ShoppingCartSolid, Heart } from '@medusajs/icons';
import useCartMutation from '@/data/cart/useCartMutation';
import { Link } from '@tanstack/react-router';
import CurrencyVND from '@/components/config/vnd';

export const Route = createFileRoute('/_layout/searchList/')({
  component: SearchList,
});

function SearchList() {
  const searchParams = useSearchParams({
    // @ts-ignore
    select: (search) => ({
      // @ts-ignore
      search: search.search
    }),
  })

  // @ts-ignore
  const keyword = searchParams.search

  const [page, setPage] = useState(1);

  const { addItemToCart } = useCartMutation();

  // Fetch dữ liệu tìm kiếm
  const { data, isLoading, isError, isFetching, isSuccess } = useSearch(
    keyword,
    10,
    page
  );

  const pagination = data?.meta || {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  };

  // Xử lý sự kiện "Load More"
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (

    <div>
      {isLoading || isFetching ? <p>Đang tải dữ liệu...</p> : null}
      
      {/* Hiển thị trạng thái Loading hoặc Error */}
      {isError && (
        <p className="text-red-500">Đã có lỗi xảy ra khi tìm kiếm.</p>
      )}

      {/* Hiển thị danh sách sản phẩm */}
      {isSuccess && data?.data.length > 0 ? (
        <>
          <div className=''>
            <div className="main-content w-full h-48 flex flex-col items-center justify-center ">
              <div className="text-content">
                <div className="text-4xl font-semibold text-center">
                  Tìm kiếm sản phẩm
                </div>
                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                  <p>
                    Kết quả tìm kiếm cho từ khóa: <span className="font-semibold">{keyword}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 pt-5 py-10">
            <div className="max-w-7xl m-auto mt-10 xl:p-0 lg:p-5 md:p-5 sm:p-5 bg-white shadow">
              <div className="mb-4 flex flex-wrap items-center justify-between sm:mb-8 mt-5 p-4">
                <div className="flex flex-wrap space-x-4 sm:space-x-8">
                  <button
                    className="border-b-2 border-gray-900 text-gray-900"
                  >
                  Tất cả sản phẩm
                  </button>
                </div>
              </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4 p-4">
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
                          </div>
                        </h2>
                        <p className="mt-2 flex justify-start text-gray-600">
                        <CurrencyVND amount={product.price} />
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
              
            </div>
          </div>
        </>
      ) : (
      <div className='main-content mx-auto max-w-7xl py-8 min-h-[50vh]'>
  <p className="text-gray-500 text-sm">
    Không có sản phẩm nào phù hợp với từ khóa: 
    <span className="font-semibold text-gray-1000 text-xl">{keyword}</span>
  </p>
</div>
      )}
    </div>
  );
}

export default SearchList;
