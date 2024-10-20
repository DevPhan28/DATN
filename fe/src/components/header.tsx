import { useFetchCart } from '@/data/cart/useFetchCart';
import {
  ArrowRightOnRectangle,
  BarsThree,
  Heart,
  MagnifyingGlassMini,
  ShoppingCartSolid,
  XMark,
} from '@medusajs/icons';
import { toast } from '@medusajs/ui';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const Header = () => {
  // Trạng thái hiển thị của menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi component được tải
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const userId = localStorage.getItem('userId');
  const { data: cartData, isLoading } = useFetchCart(userId); // Lấy dữ liệu giỏ hàng

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const totalItems =
    cartData?.products?.reduce(
      (total: any, product: any) => total + product.quantity,
      0
    ) || 0;

  // Hàm đăng xuất
  const handleLogout = () => {
    // Xóa token khỏi localStorage và đặt trạng thái đăng nhập về false
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    toast.success('Đăng xuất', {
      description: 'Bạn đã đăng xuất thành công',
    });
  };

  return (
    <div className="m-auto max-w-6xl">
      <nav className="relative">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-x-14">
            <div className="flex items-center">
              <img className="w-24" src="/logotachne.png" alt="Your Company" />
            </div>

            {/* Menu chính */}
            <div className="hidden flex-wrap sm:flex">
              <Link
                to="/"
                className="px-2 py-2 font-medium hover:text-blue-400"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="px-2 py-2 font-medium hover:text-blue-400"
              >
                Shop
              </Link>
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">
                Features
              </a>
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">
                Blog
              </a>
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">
                About
              </a>
              <a href="#" className="px-2 py-2 font-medium hover:text-blue-400">
                Contact
              </a>
            </div>
          </div>

          {/* Khu vực chứa các biểu tượng và biểu tượng menu */}
          <div className="flex items-center space-x-2 text-[19px]">
            <MagnifyingGlassMini className="text-[35px] hover:text-blue-400" />
            <Link to="/cart" className="relative">
              <ShoppingCartSolid className="text-[35px] hover:text-blue-400" />
              {/* Hiển thị tổng số lượng sản phẩm trong giỏ hàng */}
              {!isLoading && totalItems > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <Heart className="text-2xl hover:text-blue-400" />
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="flex items-center justify-center p-2 text-gray-500 hover:text-blue-400 focus:outline-none"
              >
                {isMenuOpen ? (
                  <XMark className="hover:text-blue-400" />
                ) : (
                  <BarsThree className="hover:text-blue-400" />
                )}
              </button>
            </div>
            {isLoggedIn && (
              <button onClick={handleLogout}>
                <ArrowRightOnRectangle />
              </button>
            )}
          </div>
        </div>
        {/* Danh sách menu ẩn */}
        {isMenuOpen && (
          <div className="mt-2 flex flex-col space-y-2 sm:hidden">
            <a
              href="#"
              className="block px-3 py-2 font-medium hover:text-blue-400"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-3 py-2 font-medium hover:text-blue-400"
            >
              Shop
            </a>
            <a
              href="#"
              className="block px-3 py-2 font-medium hover:text-blue-400"
            >
              Features
            </a>
            <a
              href="#"
              className="block px-3 py-2 font-medium hover:text-blue-400"
            >
              Blog
            </a>
            <a
              href="#"
              className="block px-3 py-2 font-medium hover:text-blue-400"
            >
              About
            </a>
            <a
              href="#"
              className="block px-3 py-2 font-medium hover:text-blue-400"
            >
              Contact
            </a>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
