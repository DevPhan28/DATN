import instance from '@/api/axiosIntance';
import Header from '@/components/layoutAdmin/header/header';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_layout/products/$slug/viewdetail')({
  component: DetailProduct,
});

function DetailProduct() {
  const { slug } = useParams({ from: '/dashboard/_layout/products/$slug/viewdetail' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      try {
        const response = await instance.get(`/products/slug/${slug}`);
        return response.data;
      } catch (error) {
        throw new Error('Call API thất bại');
      }
    },
    enabled: !!slug, // Đảm bảo query chỉ chạy khi `slug` tồn tại
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="h-screen overflow-y-auto">
      <Header title="Chi tiết sản phẩm" pathname="/" />
      <div className="bg-white shadow-md rounded-lg overflow-hidden m-8">
        <div className="max-w-6xl grid grid-cols-3">
          {/* Product Image */}
          <div className="p-4 flex items-center">
            <img
              src={data.product.image}
              alt={data.product.name}
              className="rounded-lg object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 uppercase">{data.product.name}</h1>
            <p className="text-black font-semibold">
              Mô tả: <span className="text-gray-600 font-sans">{data.product.description}</span>
            </p>
            <div className="text-black font-semibold">
              Giá: <span className="text-xl font-semibold text-red-600">{data.product.price}VND</span>
            </div>
            <div className="text-black font-semibold">
              Giảm giá: <span className="text-xl font-semibold text-gray-600">{data.product.discount}%</span>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-gray-800">Ảnh trưng bày</h2>
          {data.product.gallery.length > 0 ? (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {data.product.gallery.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded shadow"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
Không có hình ảnh nào trong thư viện.</p>
          )}
        </div>

        {/* Variants Section */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-gray-800">Biến thể</h2>
          {data.product.variants.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-black font-medium border">Size</th>
                    <th className="px-4 py-2 text-left text-black font-medium border">Màu</th>
                    <th className="px-4 py-2 text-left text-black font-medium border">Giá (VND)</th>
                    <th className="px-4 py-2 text-left text-black font-medium border">Sku</th>
                    <th className="px-4 py-2 text-left text-black font-medium border">Số lượng trong kho</th>
                  </tr>
                </thead>
                <tbody>
                  {data.product.variants.map((variant: any, index: number) => (
                    <tr
                      key={variant._id || index}
                      className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-4 py-2 border text-black">{variant.size}</td>
                      <td className="px-4 py-2 border text-black">{variant.color}</td>
                      <td className="px-4 py-2 border text-black">{variant.price}</td>
                      <td className="px-4 py-2 border text-black">{variant.sku}</td>
                      <td className="px-4 py-2 border text-black">{variant.countInStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">Không có sẵn các biến thể.</p>
          )}
        </div>

      </div>
    </div>
  );

}

export default DetailProduct;