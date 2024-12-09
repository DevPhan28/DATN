import { useEffect, useState } from 'react';
import banner1 from '../assets/images/banner-01.png';
import banner2 from '../assets/images/banner-02.png';
import banner3 from '../assets/images/banner-03.jpg';
import instance from '@/api/axiosIntance';
import { Link } from '@tanstack/react-router';

const Category = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get(`/categories`);
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <div className="mt-16">
        <div className="m-auto max-w-7xl p-5 sm:p-5 md:p-5 lg:p-5 xl:p-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* Hiển thị danh mục (chỉ 3 đầu tiên) */}
            {categories.slice(0, 3).map((category, index) => (
              <div
                key={category.slug} // Dùng slug làm key
                className="aspect-w-16 aspect-h-9 group relative overflow-hidden border border-gray-200"
              >
                <img
                  src={
                    index === 0 ? banner1 : index === 1 ? banner2 : banner3 // Hiển thị banner
                  }
                  alt={category.name}
                  className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4">
                  <span className="pb-2 text-3xl font-bold transition duration-500">
                    {category.name} {/* Hiển thị tên danh mục */}
                  </span>
                  <p className="text-base text-gray-500 transition duration-500">
                    Winter 2024
                  </p>
                </div>
                <div className="absolute inset-0 bg-blue-500 bg-opacity-60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <Link
                    to={`/categories/${category.slug}`} // Sử dụng slug thay vì _id
                    className="absolute bottom-4 left-4"
                  >
                    <span className="text-base font-bold text-white">
                     Mua sắm ngay
                    </span>
                    <div className="mt-1 h-[2px] w-16 bg-white"></div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
