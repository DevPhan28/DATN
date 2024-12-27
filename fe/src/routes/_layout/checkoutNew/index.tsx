import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/checkoutNew/')({
  component: NewCheckout,
})

function NewCheckout() {
  return (
    <div className='px-[35px]'>
      <div className="  p-4">

        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">| Thanh toán</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

          <div className="col-span-2 space-y-4">

            <div className="bg-white shadow rounded p-4">
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-lg">Địa chỉ nhận hàng</h2>
                <button className="text-blue-500 text-sm">Thay đổi</button>
              </div>
              <div className="mt-2 text-sm">
                <p><strong>Họ tên:</strong> dohutrung2004</p>
                <p><strong>Số điện thoại:</strong> 0973305581</p>
                <p><strong>Địa chỉ:</strong> xin chào, Xã Dị Nậu, Huyện Thạch Thất, Thành phố Hà Nội</p>
                <button className="mt-2 text-blue-500 text-sm">Mặc định</button>
              </div>
            </div>


            <div className="bg-white shadow rounded p-4">
              <h2 className="font-medium text-lg mb-4">Sản phẩm</h2>
              <div className="flex items-center border-b pb-4 mb-4">
                <img src="https://via.placeholder.com/80" alt="Product" className="w-16 h-16 object-cover rounded" />
                <div className="ml-4 flex-grow">
                  <p className="font-medium">Áo phông Sport Club</p>
                  <p className="text-sm text-gray-500">Màu: Đen | Size: M</p>
                </div>
                <div className="text-right">
                  <p>x1</p>
                  <p className="font-medium">1.000.000 đ</p>
                </div>
              </div>
              <div className="text-right font-medium">
                Tổng số tiền (1 sản phẩm): <span className="text-red-500">1.000.000 đ</span>
              </div>
            </div>
          </div>


          <div className="space-y-4">

            <div className="bg-white shadow rounded p-4">
              <h2 className="font-medium text-lg">Chi tiết thanh toán</h2>
              <div className="text-sm space-y-2 mt-4">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng</span>
                  <span>1.000.000 đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>0 đ</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Tổng thanh toán:</span>
                  <span className="text-red-500">1.000.000 đ</span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded p-4">
              <h2 className="font-medium text-lg">Nhập mã giảm giá</h2>
              <div className="flex mt-2">
                <input type="text" className="flex-grow border rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập mã giảm giá"></input>
                <button className="bg-orange-500 text-white px-4 rounded-r hover:bg-orange-600">Áp dụng</button>
              </div>
            </div>

            <div className="bg-white shadow rounded p-4">
              <h2 className="font-medium text-lg">Ghi chú</h2>
              <textarea className="w-full border rounded p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Thêm ghi chú..."></textarea>
            </div>
            {/* Phương thức thanh toán */}
            <div className="bg-white shadow rounded p-4">
              <p className="text-gray-700 font-medium mb-3">Phương thức thanh toán</p>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer transition peer-checked:border-yellow-500">
                  <input
                    type="radio"
                    name="payment_method"
                    className="hidden peer"
                  />
                  <div className="flex-grow text-gray-800 font-medium ">
                    Thanh Toán Khi Nhận Hàng
                  </div>
                  <img src="icon-cod.png" alt="COD" className="w-6 h-6" />
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer transition peer-checked:border-yellow-500">
                  <input
                    type="radio"
                    name="payment_method"
                    className="hidden peer"
                  />
                  <div className="flex-grow text-gray-800 font-medium">
                    Thanh Toán VNPAY
                  </div>
                  <img src="icon-vnpay.png" alt="VNPAY" className="w-6 h-6" />
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer transition peer-checked:border-yellow-500">
                  <input
                    type="radio"
                    name="payment_method"
                    className="hidden peer"
                  />
                  <div className="flex-grow text-gray-800 font-medium">
                    Thanh Toán MoMo
                  </div>
                  <img src="icon-momo.png" alt="MoMo" className="w-6 h-6" />
                </label>
              </div>

              <p className="text-gray-500 text-sm mt-3">
                Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản NUCSHOP
              </p>
              <button className="mt-5 w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition">
                Đặt hàng
              </button>
            </div>


          </div>
        </div>
      </div>
    </div >
  )
}