import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/thank/')({
  component: Thanks
})

function Thanks() {
  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="bg-blue-500 rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Cảm ơn bạn đã đặt hàng!</h2>
        <p className="text-gray-500 mt-2">
          Đơn hàng của bạn đã được xác nhận và đang được xử lý. Bạn có thể kiểm tra lại thông tin đơn hàng và trạng thái của nó trong phần "Đơn mua" của tài khoản của bạn. Cảm ơn bạn đã mua sắm từ chúng tôi!
        </p>
        <a href="#" className="text-blue-500 underline mt-4 inline-block">Xuất hoá đơn</a>

        <div className="mt-6 flex justify-center gap-4">
          <Link to='/orderuser' className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-black">ĐƠN MUA</Link>
          <Link to='/shop' className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-black">TIẾP TỤC MUA SẮM</Link>
        </div>
      </div>

    </div>
  )
}