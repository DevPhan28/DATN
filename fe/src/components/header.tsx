import { useFetchCart } from '@/data/cart/useFetchCart';
import { BarsThree, XMark, MagnifyingGlass } from '@medusajs/icons';
import { toast } from '@medusajs/ui';
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

const Header = () => {
  // Trạng thái hiển thị của menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Trạng thái hiển thị form tìm kiếm
  const [showInput, setShowInput] = useState(false); // Trạng thái hiển thị ô input
  // Kiểm tra trạng thái đăng nhập khi component được tải
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen); // Đổi trạng thái khi nhấn icon search
  };
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
      duration: 1000,
    });
  };
  //Phần menu của user
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // End-Phần menu của user
  // Đọc dữ liệu từ localStorage
  const storedData = JSON.parse(localStorage.getItem('user'));

  // Truy xuất tên người dùng (username)
  const username = storedData?.user?.username || 'Không có tên người dùng';

  return (
    <div className="sticky top-0 z-50 bg-white">
      {' '}
      {/* Added sticky and top-0 classes */}
      <div className="m-auto max-w-7xl p-5 sm:p-5 md:p-5 lg:p-5 xl:p-0">
        <nav className="relative">
          <div className="flex h-16 items-center justify-between">
            <div className="flex gap-x-14">
              <div className="flex items-center">
                <img
                  className="w-40"
                  src="/fasion zone.png"
                  alt="Your Company"
                />
              </div>

              {/* Main Menu */}
              <div className="hidden flex-wrap sm:flex sm:gap-1 sm:text-[10px] md:text-[14px] lg:gap-5 lg:text-[16px]">
                <Link
                  to="/"
                  className="px-2 py-2 font-medium hover:text-blue-400"
                >
                  Trang chủ
                </Link>
                <Link
                  to="/shop"
                  className="px-2 py-2 font-medium hover:text-blue-400"
                >
                  Cửa hàng
                </Link>
                <a
                  href="/featuredProducts"
                  className="relative px-2 py-2 font-medium hover:text-blue-400"
                >
                  Nổi bật
                  <span className="absolute left-14 mt-[-8px] w-9 rounded-xl bg-red-400 text-center text-xs uppercase text-white">
                    Hot
                  </span>
                </a>
                <Link
                  to="/blog"
                  className="px-2 py-2 font-medium hover:text-blue-400"
                >
                  Blog
                </Link>
                <a
                  href="#"
                  className="px-2 py-2 font-medium hover:text-blue-400"
                >
                  Về chúng tôi
                </a>
                <a
                  href="#"
                  className="px-2 py-2 font-medium hover:text-blue-400"
                >
                  Liên hệ
                </a>
              </div>
            </div>

            {/* Icons and menu toggle button */}
            <div className="flex items-center space-x-2 text-[19px]">
              {/* Icon search */}

              {/* <a href="/searchList">
                <i
                  className="fa-solid fa-magnifying-glass cursor-pointer p-3 text-[20px] hover:text-blue-400"
                  onClick={toggleSearch}
                ></i>
              </a> */}
              <div className="mx-auto flex max-w-md items-center space-x-2">
                {/* Hiển thị ô input khi nhấn nút "Search" */}
                {showInput && (
                  <div className="flex w-full overflow-hidden rounded-full border bg-white px-1 py-1 font-[sans-serif]">
                    <input
                      type="text"
                      placeholder="Search Something..."
                      className="w-full bg-white pl-4 text-sm outline-none"
                    />
                  </div>
                )}

             
                <button
                  onClick={() => setShowInput(prev => !prev)} // Đảo ngược trạng thái hiển thị
                  type="button"
                  className="rounded-full  px-5 py-2 text-sm  transition-all hover:opacity-90"
                >
                 <Link to={"/shop"}> <MagnifyingGlass/></Link>
                </button>
              </div>
              <Link to="/cart" className="relative">
                <i className="fa-solid fa-cart-shopping text-[20px] hover:text-blue-400"></i>
                {/* Display total items in the cart */}
                {!isLoading && totalItems > 0 && (
                  <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              <div className="flex items-center sm:hidden ">
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
              <div className="group relative z-10" ref={menuRef}>
                <div
                  onClick={toggleMenu}
                  className="custom-cursor-on-hover flex cursor-pointer items-center gap-x-2 ml-8"
                >
                  {isLoggedIn ? (
                    <>
                      <img
                        src="https://res.cloudinary.com/dlzhmxsqp/image/upload/v1716288330/e_commerce/s4nl3tlwpgafsvufcyke.jpg"
                        alt=""
                        className="size-8 rounded-full object-cover"
                      />
                      <span className="hidden text-base font-medium md:flex">
                        {username || 'kkk'}
                      </span>
                    </>
                  ) : (
                    <i className="fa-solid fa-user text-[20px] hover:text-blue-400"></i>
                  )}
                </div>

                {isMenuOpen && (
                  <ul className="absolute right-3 top-10 w-44 cursor-pointer rounded bg-white text-lg shadow-lg">
                    {isLoggedIn ? (
                      <>
                        <li className="hidden px-3 hover:bg-white hover:text-blue-400">
                          <a className="block w-full" href="/admin">
                            Trang quản trị
                          </a>
                        </li>
                        <li className="custom-cursor-on-hover p-1 px-3 hover:bg-white hover:text-blue-400">
                          <Link to="/account" className="block w-full" href="#">
                            Cập nhật mật khẩu
                          </Link>
                        </li>
                        <li className="custom-cursor-on-hover p-1 px-3 hover:bg-white hover:text-blue-400">
                          <Link
                            to="/orderuser"
                            className="block w-full"
                            href="#"
                          >
                            Đơn mua
                          </Link>
                        </li>
                        <li className="custom-cursor-on-hover block w-full p-1 px-3 hover:bg-white hover:text-blue-400">
                          <a
                            onClick={handleLogout}
                            href="#"
                            className="block w-full"
                          >
                            Đăng xuất
                          </a>
                        </li>
                      </>
                    ) : (
                      <div className="w-[300px] rounded-xl bg-[#F7F4F0] p-4 text-center">
                        <Link to="/login">
                          <a
                            className="button-main w-full rounded-lg bg-[#3B82F6] p-2 px-6 text-center text-white hover:bg-black"
                            href="/buyer/login"
                          >
                            Đăng nhập
                          </a>
                        </Link>
                        <div className="mt-3 text-gray-500">
                          Bạn chưa có tài khoản?
                          <Link
                            className="w-full pl-1 text-black hover:underline"
                            to="/register"
                          >
                            Đăng ký
                          </Link>
                        </div>
                      </div>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          {/* Hidden menu for mobile view */}
          {isMenuOpen && (
            <div className="mt-2 flex flex-col space-y-2 sm:hidden">
              <a
                href="#"
                className="block px-3 py-2 font-medium hover:text-blue-400"
              >
                Trang chủ
              </a>
              <a
                href="#"
                className="block px-3 py-2 font-medium hover:text-blue-400"
              >
                Cửa hàng
              </a>
              <a
                href="#"
                className="block px-3 py-2 font-medium hover:text-blue-400"
              >
                Nổi bật
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
                Về chúng tôi
              </a>
              <a
                href="#"
                className="block px-3 py-2 font-medium hover:text-blue-400"
              >
                Liên hệ
              </a>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Header;
