import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import instance from '@/api/axiosIntance';

export const Route = createFileRoute('/_layout/$id/detailproduct')({
  component: () => {
    const { id } = useParams({ from: '/_layout/$id/detailproduct' });
    console.log(id);

    if (!id) {
      console.warn('khong tim thay id ');
      return <div>khong tim that id </div>;
    }

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const response = await instance.get(`/products/${id}`);
          console.log('Product response:', response.data);

          if (response.data && response.data.data) {
            setProduct(response.data.data);
          } else {
            throw new Error('Product data is missing');
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          setError('Error fetching product');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }, [id]);

    console.log('DetailProduct component rendered');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col md:flex-row rounded-lg bg-white p-6 shadow-lg w-full max-w-7xl h-full">
          <div className="mr-4 flex flex-col items-center">
          
            {product.gallery && product.gallery.map((img, index) => (
              <img
                key={index}
                alt={`Thumbnail ${index + 1}`}
                className="mb-2 h-20 w-20 rounded-md"
                src={img}
              />
            ))}
          </div>
          <div className="flex flex-col items-center">
            {/* Hiển thị hình ảnh chính của sản phẩm */}
            <img
              alt="Main product image"
              className="mb-4 h-auto w-96 rounded-md"
              src={product.image}
            />
          </div>
          <div className="ml-10 mt-4 md:mt-0 flex-1">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="mt-2 text-xl text-gray-700">${product.price}</p>
            <p className="mt-4 text-gray-600">{product.description}</p>
            <div className="mt-6">
              {/* Hiển thị size và color chọn lựa */}
              <div className="mb-4 flex items-center">
                <label className="w-20 text-gray-700">Size</label>
                <select className="flex-1 rounded border border-gray-300 p-2">
                  {product.variants && product.variants.map(variant => (
                    <option key={variant.sku} value={variant.size}>{variant.size}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <label className="w-20 text-gray-700">Color</label>
                <select className="flex-1 rounded border border-gray-300 p-2">
                  {product.variants && product.variants.map(variant => (
                    <option key={variant.sku} value={variant.color}>{variant.color}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <button className="rounded border border-gray-300 p-2">-</button>
                <input
                  className="mx-2 w-12 rounded border border-gray-300 p-2 text-center"
                  type="text"
                  value="1" // Giá trị mặc định là 1
                />
                <button className="rounded border border-gray-300 p-2">+</button>
              </div>
              <button className="w-full rounded bg-blue-500 p-3 text-white">
                ADD TO CART
              </button>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <i className="far fa-heart text-gray-500"></i>
              <i className="fab fa-facebook text-gray-500"></i>
              <i className="fab fa-twitter text-gray-500"></i>
              <i className="fab fa-google-plus text-gray-500"></i>
            </div>
          </div>
        </div>
      </div>
    );
  },
});