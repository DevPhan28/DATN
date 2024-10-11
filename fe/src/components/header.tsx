import { Link } from '@tanstack/react-router';
import { useState } from 'react'
import { MagnifyingGlassMini, ShoppingCartSolid, Heart, BarsThree, XMark } from "@medusajs/icons"
const Header = () => {
  // Trạng thái hiển thị của menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (

    <div className="max-w-6xl m-auto">
      <nav className="relative">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-x-14">
            <div className="flex items-center">
              <img className="h-8 w-24" src="https://picsum.photos/id/237/500/100" alt="Your Company" />
            </div>

            {/* Menu chính */}
            <div className="hidden sm:flex flex-wrap">
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">Home</a>
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">Shop</a>
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">Features</a>
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">Blog</a>
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">About</a>
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">Contact</a>
            </div>
          </div>

          {/* Khu vực chứa các biểu tượng và biểu tượng menu */}
          <div className="text-[19px] flex items-center space-x-2">
            <MagnifyingGlassMini className='text-[35px] hover:text-blue-400' />
            <ShoppingCartSolid className='text-[35px] hover:text-blue-400' />
            <Heart className=' hover:text-blue-400 text-2xl' />
            {/* Biểu tượng menu nằm bên phải các biểu tượng */}
            <div className="sm:hidden flex items-center">
              <button onClick={toggleMenu} className="flex items-center justify-center p-2 text-gray-500 hover:text-blue-400 focus:outline-none">
                {isMenuOpen ? (
                  <XMark className='hover:text-blue-400' />
                ) : (
                  <BarsThree className='hover:text-blue-400' />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Danh sách menu ẩn */}
        {isMenuOpen && (
          <div className="sm:hidden flex flex-col space-y-2 mt-2">
            <a href="#" className="block px-3 py-2 font-medium hover:text-blue-400">Home</a>
            <a href="#" className="block px-3 py-2 font-medium hover:text-blue-400">Shop</a>
            <a href="#" className="block px-3 py-2 font-medium hover:text-blue-400">Features</a>
            <a href="#" className="block px-3 py-2 font-medium hover:text-blue-400">Blog</a>
            <a href="#" className="block px-3 py-2 font-medium hover:text-blue-400">About</a>
            <a href="#" className="block px-3 py-2 font-medium hover:text-blue-400">Contact</a>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
