import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useFetchCart } from '@/data/cart/useFetchCart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useCheckoutMutation from '@/data/oder/useOderMutation';


export const Route = createFileRoute('/_layout/checkout')({
  component: () => {
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || []; // Các sản phẩm đã chọn

    // Địa chỉ
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const { createOrder } = useCheckoutMutation(); // Sử dụng hook `createOrder`

    // Tải dữ liệu địa chỉ
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'
          );
          setCities(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, []);

    const handleCityChange = (e) => {
      const cityId = e.target.value;
      setSelectedCity(cityId);
      setSelectedDistrict('');
      setWards([]);
    };

    const handleDistrictChange = (e) => {
      const districtId = e.target.value;
      setSelectedDistrict(districtId);
      const selectedDistrict = cities
        .find((city) => city.Id === selectedCity)
        ?.Districts.find((district) => district.Id === districtId);
      setWards(selectedDistrict ? selectedDistrict.Wards : []);
    };

    const handleWardChange = (e) => {
      setSelectedWard(e.target.value);
    };

    const totalAmount = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const cityName = cities.find((city) => city.Id === selectedCity)?.Name || '';
    const districtName =
      cities
        .find((city) => city.Id === selectedCity)
        ?.Districts.find((district) => district.Id === selectedDistrict)?.Name || '';
    const wardName =
      cities
        .find((city) => city.Id === selectedCity)
        ?.Districts.find((district) => district.Id === selectedDistrict)
        ?.Wards.find((ward) => ward.Id === selectedWard)?.Name || '';

        const handleSubmit = (e) => {
          e.preventDefault();
          const userId = localStorage.getItem('userId');
        
          const formData = {
            userId,
            items: selectedItems.map((item) => ({
              productId: item.productId, // Đảm bảo `productId` được truyền chính xác
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              variantId: item.variantId, // Nếu cần thiết
            })),
            customerInfo: {
              name: e.target.your_name.value,
              phone: e.target['phone-input'].value,
              email: e.target.your_email.value,
              city: cityName,
              districts: districtName,
              wards: wardName,
            },
            totalPrice: totalAmount,
          };
        
          console.log("Form Data:", formData); // Kiểm tra cấu trúc `formData` trước khi gửi
        
          createOrder.mutate(formData);
        };
        

    return (
      <div>
        <section className="m-auto mt-10 max-w-6xl p-5">
          <form onSubmit={handleSubmit} className="mx-auto max-w-screen-xl px-4">
            {/* Đường dẫn thông tin giao hàng */}
            <div className="flex justify-center">
              <ol className="flex w-[600px] text-gray-500 dark:text-gray-400">
                <li className="text-primary-700 dark:text-primary-500 flex items-center after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block">
                  <span className="flex items-center after:mx-2 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                    Checkout
                  </span>
                </li>
                <li className="text-primary-700 dark:text-primary-500 flex items-center after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:after:border-gray-700 sm:after:inline-block">
                  <span className="flex items-center after:mx-2 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                    Check
                  </span>
                </li>
                <li className="flex shrink-0 items-center">Order summary</li>
              </ol>
            </div>

            <div className="mt-6 lg:flex lg:items-start lg:gap-12">
              {/* Form nhập thông tin giao hàng */}
              <div className="flex-1 space-y-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delivery Information
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="your_name" className="mb-2 block text-sm font-medium text-gray-900">
                      Your name
                    </label>
                    <input
                      type="text"
                      id="your_name"
                      className="block w-full rounded-lg border p-2.5 text-sm bg-gray-50 dark:bg-gray-700"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="your_email" className="mb-2 block text-sm font-medium text-gray-900">
                      Your email
                    </label>
                    <input
                      type="email"
                      id="your_email"
                      className="block w-full rounded-lg border p-2.5 text-sm bg-gray-50 dark:bg-gray-700"
                      placeholder="Your email"
                      required
                    />
                  </div>

                  {/* Chọn Tỉnh, Quận, Xã */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Tỉnh thành</label>
                    <select
                      value={selectedCity}
                      onChange={handleCityChange}
                      className="block w-full rounded-lg border p-2.5 text-sm bg-gray-50 dark:bg-gray-700"
                    >
                      <option value="">Chọn tỉnh thành</option>
                      {cities.map((city) => (
                        <option key={city.Id} value={city.Id}>
                          {city.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Quận/huyện</label>
                    <select
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      className="block w-full rounded-lg border p-2.5 text-sm bg-gray-50 dark:bg-gray-700"
                    >
                      <option value="">Chọn quận/huyện</option>
                      {selectedCity &&
                        cities
                          .find((city) => city.Id === selectedCity)
                          ?.Districts.map((district) => (
                            <option key={district.Id} value={district.Id}>
                              {district.Name}
                            </option>
                          ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Xã</label>
                    <select
                      onChange={handleWardChange}
                      value={selectedWard || ''}
                      className="block w-full rounded-lg border p-2.5 text-sm bg-gray-50 dark:bg-gray-700"
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((ward) => (
                        <option key={ward.Id} value={ward.Id}>
                          {ward.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone-input" className="block text-sm font-medium text-gray-900">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone-input"
                      className="block w-full rounded-lg border p-2.5 text-sm bg-gray-50 dark:bg-gray-700"
                      placeholder="123-456-7890"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="code_postal" className="block text-sm font-medium text-gray-900">
                      Địa chỉ cụ thể
                    </label>
                    <input
                      type="text"
                      id="code_postal"
                      className="block w-full rounded-lg border p-2.5 text-sm bg-gray-50 dark:bg-gray-700"
                      placeholder="Address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="mt-4 lg:mt-0 lg:max-w-xs">
                <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
                {selectedItems.map((product) => (
                  <div key={product.id} className="flex gap-3 p-4 shadow-md">
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg" />
                    <div>
                      <h4 className="text-lg font-medium">{product.name}</h4>
                      <p className="text-gray-500">Size: {product.size}, Color: {product.color}</p>
                      <p className="text-lg font-bold">${(product.price * product.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="rounded-lg bg-gray-50 p-4 shadow-md mt-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm font-medium">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-sm font-bold">Total</span>
                    <span className="text-sm font-bold">${totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    type="submit"
                    className="mt-5 w-full bg-blue-400 py-2.5 font-medium uppercase text-black hover:bg-black hover:text-white"
                  >
                    Check out
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  },
});
