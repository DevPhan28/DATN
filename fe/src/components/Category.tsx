import banner1 from '../assets/images/banner-01.jpg';
import banner2 from '../assets/images/banner-02.jpg';
import banner3 from '../assets/images/banner-03.jpg';
const Category = () => {
  return (
    <div>
      <div className="mt-16">
        <div className="max-w-6xl m-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* Women Category */}
            <div className="aspect-w-16 aspect-h-9 group relative overflow-hidden border border-gray-200">
              <img
                src={banner1}
                alt="Women"
                className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4">
                <span className="pb-2 text-3xl font-bold transition duration-500">
                  Women
                </span>
                <p className="text-base text-gray-500 transition duration-500">
                  Spring 2018
                </p>
              </div>
              <div className="absolute inset-0 bg-blue-500 bg-opacity-60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <a href="product.html" className="absolute bottom-4 left-4">
                  <span className="text-base font-bold text-white">
                    Shop now
                  </span>
                  <div className="mt-1 h-[2px] w-16 bg-white"></div>
                </a>
              </div>
            </div>

            {/* Men Category */}
            <div className="aspect-w-16 aspect-h-9 group relative overflow-hidden border border-gray-200">
              <img
                src={banner2}
                alt="Men"
                className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4">
                <span className="pb-2 text-3xl font-bold transition duration-500">
                  Men
                </span>
                <p className="text-base text-gray-500 transition duration-500">
                  Spring 2018
                </p>
              </div>
              <div className="absolute inset-0 bg-blue-500 bg-opacity-60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <a href="product.html" className="absolute bottom-4 left-4">
                  <span className="text-base font-bold text-white">
                    Shop now
                  </span>
                  <div className="mt-1 h-[2px] w-16 bg-white"></div>
                </a>
              </div>
            </div>

            {/* Accessories Category */}
            <div className="aspect-w-16 aspect-h-9 group relative overflow-hidden border border-gray-200">
              <img
                src={banner3}
                alt="Accessories"
                className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4">
                <span className="pb-2 text-3xl font-bold transition duration-500">
                  Accessories
                </span>
                <p className="text-base text-gray-500 transition duration-500">
                  New Trend
                </p>
              </div>
              <div className="absolute inset-0 bg-blue-500 bg-opacity-60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <a href="product.html" className="absolute bottom-4 left-4">
                  <span className="text-base font-bold text-white">
                    Shop now
                  </span>
                  <div className="mt-1 h-[2px] w-16 bg-white"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
