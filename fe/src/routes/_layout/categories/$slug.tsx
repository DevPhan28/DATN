import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import instance from '@/api/axiosIntance';
import { Heart, ShoppingCartSolid } from '@medusajs/icons';

export const Route = createFileRoute('/_layout/categories/$slug')({
  component: ProductCategory,
});

function ProductCategory() {
  const { slug: categorySlug } = useParams({
    from: '/_layout/categories/$slug',
  });
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) {
      setError('Không tìm thấy ID danh mục');
      setLoading(false);
      return;
    }
    const fetchCategory = async () => {
      try {
        const response = await instance.get(`/categories/${categorySlug}`);
        if (response.data && response.data.category) {
          setCategoryName(response.data.category.name);
          setProducts(response.data.products || []);
        } else {
          setError('Không có sản phẩm nào trong danh mục này');
        }
      } catch (err) {
        setError('Không thể tải danh mục sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categorySlug]);

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Sản phẩm trong danh mục {categoryName || 'Chưa rõ danh mục'}
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            Không có sản phẩm nào trong danh mục này.
          </p>
        ) : (
          products.map((product: Product) => (
            <div
              key={product._id}
              className="product-card group relative overflow-hidden p-2 text-center"
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
          ))
        )}
      </div>
    </div>
  );
}

export default ProductCategory;
