import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useFetchCategory } from '@/data/products/useProductList';

const BlogPage = () => {
  const { data: listCategory } = useFetchCategory();

  return (
    <>
      {/* Title page */}
      <section
        className="bg-cover bg-center text-center py-24 px-6"
        style={{ backgroundImage: "url('https://picsum.photos/seed/picsum/200/300')" }}
      >
        <h2 className="text-4xl font-bold text-white">Blog</h2>
      </section>

      {/* Content page */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
            {/* Blog Posts */}
            <div className="w-full lg:w-2/3 px-4 mb-12 lg:mb-0">
              {[1, 2, 3].map((item, index) => (
                <div key={index} className="mb-16">
                  <a href="/blog-detail" className="block relative overflow-hidden group">
                    <img
                      src="https://picsum.photos/seed/picsum/200/300"
                      alt={`Img blog`}
                      className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 flex flex-col items-center bg-black/70 text-white py-2 px-4 rounded-lg">
                      <span className="text-xl">22</span>
                      <span className="text-sm">Jan 2018</span>
                    </div>
                  </a>
                  <div className="pt-8">
                    <h4 className="text-2xl font-semibold mb-4">
                      <a
                        href="/blog-detail"
                        className="hover:text-blue-600 transition-colors duration-300"
                      >
                       8 Inspiring Ways to Wear Dresses in the Winter
                      </a>
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Class aptent taciti sociosqu ad litora torquent per conubia nostra.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">
                        <span>By Admin | StreetStyle, Fashion | 8 Comments</span>
                      </span>
                      <a
                        href="/blog-detail"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                      >
                        Continue Reading <i className="fa fa-long-arrow-right ml-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 px-4">
              <div className="relative mb-12">
                <input
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none"
                  type="text"
                  name="search"
                  placeholder="Search"
                />
                <button className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500">
                  <i className="zmdi zmdi-search"></i>
                </button>
              </div>

              {/* Dynamic Categories */}
              <div>
                <h4 className="text-xl font-semibold mb-8">Categories</h4>
                <ul>
                  {listCategory?.map((category) => (
                    <li key={category._id} className="border-b border-gray-200 last:border-none">
                      <a
                        href="#"
                        className="block py-4 text-gray-700 hover:text-blue-600 transition-colors duration-300"
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Định nghĩa route cho trang Blog
export const Route = createFileRoute('/_layout/blog/')({
  component: BlogPage,
});

export default BlogPage;
