import instance from '@/api/axiosIntance';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const Footer = () => {
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
    <>
      <div className="bg-[#222222] p-5 text-white sm:p-5 md:p-10 lg:p-16">
        <div className="m-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-x-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
            <div className="mb-6">
              <h4 className="mb-5 font-bold uppercase">Categories</h4>
              {categories.slice(0, 4).map((category, index) => (
                <Link to={`/categories/${category.slug}`}>
                  <p key={index} className="mb-5 text-sm text-[#B2B2B2]">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mb-6">
              <h4 className="mb-5 font-bold uppercase">Help</h4>
              <p className="mb-5 text-sm text-[#B2B2B2]">Track Order</p>
              <p className="mb-5 text-sm text-[#B2B2B2]">Returns</p>
              <p className="mb-5 text-sm text-[#B2B2B2]">Shipping</p>
              <p className="mb-5 text-sm text-[#B2B2B2]">FAQs</p>
            </div>
            <div className="mb-6">
              <h4 className="mb-5 font-bold uppercase">GET IN TOUCH</h4>
              <p className="mb-5 text-sm text-[#B2B2B2]">
                Any questions? Let us know in store at 8th floor, 379 Hudson St,
                New York, NY 10018 or call us on (+1) 96 716 6879
              </p>
              <div className="flex space-x-8 text-lg text-[#B2B2B2]">
                <i className="fa-brands fa-facebook-f"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-twitter"></i>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-bold uppercase">Newsletter</h4>
              <div>
                <div className="border-b">
                  <input
                    type="text"
                    placeholder="email@example.com"
                    className="w-full rounded-md bg-transparent p-2 focus:outline-none"
                  />
                </div>
                <button className="mt-5 rounded-3xl bg-blue-400 p-3 px-10 font-semibold uppercase text-white hover:bg-white hover:text-blue-400">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
