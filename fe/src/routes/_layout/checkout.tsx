import { createFileRoute, useLocation } from '@tanstack/react-router';

import { useEffect, useState } from 'react';
import axios from 'axios';
import useCheckoutMutation from '@/data/oder/useOderMutation';
import useCartMutation from '@/data/cart/useCartMutation';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronRightMini, CurrencyDollarSolid, DocumentTextSolid, MapPin, User } from '@medusajs/icons';



export const Route = createFileRoute('/_layout/checkout')({
  component: () => {
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || []; // Các sản phẩm đã chọn
    console.log("san pham da select", selectedItems)
    const { deleteItemFromCart } =
      useCartMutation();
    const queryClient = useQueryClient()


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
          image: item.image,
          variantId: item.variantId, // Nếu cần thiết
        })),
        customerInfo: {
          name: e.target.your_name.value,
          phone: e.target['phone-input'].value,
          email: e.target.your_email.value,
          city: cityName,
          districts: districtName,
          wards: wardName,
          address: e.target['address-input'].value,
        },
        totalPrice: totalAmount,
      };

      console.log("Form Data:", formData); // Kiểm tra cấu trúc `formData` trước khi gửi

      createOrder.mutate(formData, {
        onSuccess: async () => {
          // Lặp qua tất cả sản phẩm đã chọn và xóa
          const deletePromises = selectedItems.map((item) =>
            deleteItemFromCart.mutateAsync({
              userId: userId || '',
              productId: item.productId,
              variantId: item.variantId || '',
            })
          );

          try {
            await Promise.all(deletePromises); // Xóa tất cả sản phẩm
            console.log("Sản phẩm đã xóa sau khi thanh toán:", selectedItems);
            queryClient.invalidateQueries({
              queryKey: ['cart'],
            });
          } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
          }
        },
      });
    };

    return (
      <section className="">
        <div className='bg-[#F7F4F0]'>
          <div className="main-content w-full h-48 flex flex-col items-center justify-center ">
            <div className="text-content">
              <div className="text-4xl font-semibold text-center">
                Check out
              </div>
              <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                <div className="flex items-center justify-center">
                  <a href="/">Home</a>
                  <ChevronRightMini />
                </div>
                <div className="flex items-center justify-center">
                  <a href="#">Cart</a>
                  <ChevronRightMini />
                </div>
                <div className="text-gray-500 capitalize">
                  Check out
                </div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className='bg-[#F3F4F6] w-full pt-10 py-10'>
          <div className="m-auto max-w-7xl  bg-white p-5 ">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
              <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
                {/* form nhap thong tin  */}
                <div className="min-w-0 flex-1 space-y-8">
                  <div className="space-y-4 items-center  ">
                    <div className="flex gap-2 text-red-500">
                      <User className='mt-1' />
                      <h2 className="text-xl font-semibol uppercase">Delivery Information</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="your_name" className="mb-2 block text-sm font-medium text-gray-900 "> Your name </label>
                        <input type="text" id="your_name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 " placeholder="what your name" required />
                      </div>
                      <div>
                        <label htmlFor="phone-input-3" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone Number<span className='text-red-500'> *</span></label>
                        <div className="flex items-center">

                          <div className="relative w-full">
                            <input type="text" id="phone-input" className="z-20 block w-full rounded-lg border  border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 " placeholder="123-456-7890" required />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="your_email" className="mb-2 block text-sm font-medium text-gray-900 ">email:</label>
                        <input type="text" id="your_email" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 " placeholder="what your name" required />
                      </div>
                    </div>
                    <div className="flex gap-2 text-red-500">
                      <MapPin className='mt-1' />
                      <h2 className="text-xl font-semibol uppercase">Delivery address</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <label htmlFor="select-country-input-3" className="block text-sm font-medium text-gray-900 dark:text-white"> Tỉnh thành<span className='text-red-500'> *</span> </label>
                        </div>
                        <select
                          value={selectedCity || ""}
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
                        <div className="mb-2 flex items-center gap-2">
                          <label htmlFor="select-city-input-3" className="block text-sm font-medium text-gray-900 dark:text-white"> Quận/huyện<span className='text-red-500'> *</span> </label>
                        </div>
                        <select
                          value={selectedDistrict || ""}
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
                        <div className="mb-2 flex items-center gap-2">
                          <label htmlFor="select-district-input-3" className="block text-sm font-medium text-gray-900 dark:text-white"> Xã <span className='text-red-500'>*</span></label>
                        </div>
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
                    </div>

                  </div>
                  <div>
                    <label htmlFor="address-input" className="block text-sm font-medium text-gray-900">
                      Địa chỉ cụ thể
                    </label>
                    <input
                      type="text"
                      id="address-input"
                      className="block w-full rounded-lg border p-2.5 text-sm bg-gray-50 dark:bg-gray-700"
                      placeholder="Address"
                      required
                    />
                  </div>
                </div>

              </div >
            </div >

          </div >
          <div className='m-auto max-w-7xl  bg-white p-5 pt-10 mt-5'>
            <div className="overflow-x-auto bg-white p-5">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <tr className="border-b transition-colors  ">
                    <th className="h-12 px-4 text-left align-middle  pl-0 text-lg font-normal text-[#222] min-w-48">
                      Product
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium  text-[#0000008a]">
                      Price
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium  text-[#0000008a]">
                      Quantity
                    </th>
                    <th className="h-12 px-4 align-middle font-medium  pr-0 text-[#0000008a] text-end">
                      Toal
                    </th>
                  </tr>
                  <tbody className="[&_tr:last-child]:border-0">
                    {selectedItems.map((product) => (
                      <tr className="border-b transition-colors  ">

                        <td className="p-4 align-middle  flex items-center gap-3 pl-0">
                          <div className="size-10 min-w-10 min-h-10">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="line-clamp-1 text-black">{product.name}</p>
                            <span className="text-[#929292]">category: Color {product.color}, Size {product.size}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle ">${product.price}</td>
                        <td className="p-4 align-middle ">{product.quantity}</td>
                        <td className="p-4 align-middle  pr-0 text-end">${(product.price * product.quantity).toFixed(2)}</td>

                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
              <div className='mt-5 flex gap-2 items-center'>
                <label htmlFor="" className="text-nowrap custom-cursor-default-hover">Message:</label>
                <input name="noteMessage" type="text" placeholder="Nhập vô..." className="border border-gray-300 w-full py-1 px-3 rounded-sm " />
              </div>
              <div className="flex justify-end mt-5">
                <div className="flex gap-2 items-center font-semibold text-xl">
                  Tổng số tiền (2 sản phẩm): <span className="text-red-500 text-xl">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

            </div>

          </div>
          <div className='m-auto max-w-7xl  bg-white p-5 pt-10 mt-5'>
            <div className="flex flex-wrap gap-2 items-center">
              <CurrencyDollarSolid className="text-red-500" />
              <div className="text-xl">Payment method:</div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="border p-3 rounded-lg focus:outline-none focus:border-red-500 active:border-red-500 w-full sm:w-auto">
                  Payment upon receipt
                </button>
                <button className="border p-3 rounded-lg focus:outline-none focus:border-red-500 active:border-red-500 w-full sm:w-auto">
                  VNP payment
                </button>
              </div>
            </div>
            <hr className='mt-10' />
            <div className="flex flex-col md:flex-row items-start justify-between gap-5 border-t border-gray-200 py-5">
              <h2 className="flex items-center gap-2 text-xl">
                <DocumentTextSolid className='text-red-500' />
                Payment details:
              </h2>
              <div>
                <div className="flex gap-24 justify-between">
                  <h5 className='text-gray-500 text-xl'>Total product:</h5>
                  <div className='text-right'>${totalAmount.toFixed(2)}</div>
                </div>
                <div className="flex gap-24 justify-between">
                  <h5 className='text-gray-500 text-xl'>product discounts:</h5>
                  <div className='text-right'>$0</div>
                </div>
                <div className="flex gap-24 justify-between">
                  <h5 className='text-gray-500 text-xl'>Total:</h5>
                  <div className='text-right'>${totalAmount.toFixed(2)}</div>
                </div>
              </div>

            </div>
            <div className="text-right mt-4">
              <button type="submit" className="w-full md:w-56 py-1.5 px-4 rounded bg-blue-500 hover:bg-black text-white">Đặt hàng</button>
            </div>
          </div>
        </form >

      </section >
    );
  },
});