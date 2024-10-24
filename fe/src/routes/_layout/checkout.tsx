import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/checkout')({
  component: () => <div>
 <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
    {/* Đường dẫn thông tin giao hàng  */}
    <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
      <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
        <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden"> 
          Checkout
        </span>
      </li>
      <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
        <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
          check
        </span>
      </li>
      <li className="flex shrink-0 items-center">
        Order summary
      </li>
    </ol>
    <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
      {/* form nhap thong tin  */}
      <div className="min-w-0 flex-1 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="your_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your name </label>
              <input type="text" id="your_name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="the quyyen" required />
            </div>
            <div>
              <label htmlFor="your_email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your email* </label>
              <input type="email" id="your_email" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="thequyen@gmail.com" required />
            </div>
            {/* city */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <label htmlFor="select-country-input-3" className="block text-sm font-medium text-gray-900 dark:text-white"> Tỉnh thành* </label>
              </div>
              <select id="select-country-input-3" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                <option selected>United States</option>
                <option value="AS">Australia</option>
                <option value="FR">France</option>
                <option value="ES">Spain</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
            {/*  */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <label htmlFor="select-city-input-3" className="block text-sm font-medium text-gray-900 dark:text-white"> Quận/huyện* </label>
              </div>
              <select id="select-city-input-3" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                <option selected>San Francisco</option>
                <option value="NY">New York</option>
                <option value="LA">Los Angeles</option>
                <option value="CH">Chicago</option>
                <option value="HU">Houston</option>
              </select>
            </div>
               {/*  */}
               <div>
              <div className="mb-2 flex items-center gap-2">
                <label htmlFor="select-city-input-3" className="block text-sm font-medium text-gray-900 dark:text-white"> Xã* </label>
              </div>
              <select id="select-city-input-3" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                <option selected>San Francisco</option>
                <option value="NY">New York</option>
                <option value="LA">Los Angeles</option>
                <option value="CH">Chicago</option>
                <option value="HU">Houston</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="phone-input-3" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone Number* </label>
              <div className="flex items-center">
            
                <div className="relative w-full">
                  <input type="text" id="phone-input" className="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500" placeholder="123-456-7890" required />
                </div>
              </div>
            </div>
          
            <div>
              <label htmlFor="code_postal" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Code postal </label>
              <input type="text" id="code_postal" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Flowbite LLC" required />
            </div>
            <div>
              <label htmlFor="vat_number" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> VAT number </label>
              <input type="text" id="vat_number" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="DE42313253" required />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
              Save address
              </button>
            </div>
          </div>
        </div>
        {/* Phuong thuc thanh toan */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input id="credit-card" aria-describedby="credit-card-text" type="radio" name="payment-method" className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" defaultChecked />
                </div>
                <div className="ms-4 text-sm">
                  <label htmlFor="credit-card" className="font-medium leading-none text-gray-900 dark:text-white"> Credit Card </label>
                  <p id="credit-card-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Pay with your credit card</p>
                </div>
              </div>
            
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input id="pay-on-delivery" aria-describedby="pay-on-delivery-text" type="radio" name="payment-method"  className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />
                </div>
                <div className="ms-4 text-sm">
                  <label htmlFor="pay-on-delivery" className="font-medium leading-none text-gray-900 dark:text-white"> Payment on delivery </label>
                  <p id="pay-on-delivery-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">+$15 payment processing fee</p>
                </div>
              </div>
            
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input id="paypal-2" aria-describedby="paypal-text" type="radio" name="payment-method"  className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />
                </div>
                <div className="ms-4 text-sm">
                  <label htmlFor="paypal-2" className="font-medium leading-none text-gray-900 dark:text-white"> Paypal account </label>
                  <p id="paypal-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Connect to your account</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
       
      
      </div>
      {/* chi tiet tien hang  */}
      <div className="mt-4 w-full space-y-4 sm:mt-6 lg:mt-0 lg:max-w-xs xl:max-w-md">
  {/* Thông tin sản phẩm */}
  <div className="bg-white p-4 rounded-lg shadow-md">
    <div className="flex justify-center">
      <img 
        src="https://picsum.photos/seed/picsum/200/300" 
        alt="Product" 
        className="h-32 w-32 object-cover rounded-lg"
      />
    </div>
    
    <div className="mt-4">
      <h1 className="text-xl font-bold text-gray-900">Sản phẩm 1</h1>
      <p className="mt-1 text-lg text-gray-700">Giá: $1,000.00</p>
    </div>

    <div className="mt-4 space-y-2">
      <div className="flex items-center">
        <label className="w-16 text-gray-700">Size</label>
        <p className="text-gray-900">Medium</p>
      </div>
      <div className="flex items-center">
        <label className="w-16 text-gray-700">Color</label>
        <p className="text-gray-900">Red</p>
      </div>
    </div>
  </div>
  

  {/* Tổng tiền */}
  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-normal text-gray-500">Subtotal</span>
        <span className="text-sm font-medium text-gray-900">$8,094.00</span>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
        <span className="text-sm font-bold text-gray-900">Total</span>
        <span className="text-sm font-bold text-gray-900">$8,094.00</span>
      </div>
    </div>

    {/* Mã giảm giá */}
    <div className="mt-4">
      <label htmlFor="voucher" className="block text-sm font-medium text-gray-900 mb-1">Mã giảm giá</label>
      <div className="flex items-center space-x-2">
        <input 
          type="text" 
          id="voucher" 
          className="w-full rounded-lg border-gray-300 p-2 text-sm bg-gray-50 focus:border-primary-500 focus:ring-primary-500" 
          placeholder="Nhập mã"
        />
        <button className="bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300">Áp dụng</button>
      </div>
    
    </div>
     <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
              Next
              </button>
   
  </div>

  {/* Hành động */}
  <div className="space-y-2">
    <button className="w-full flex items-center justify-center bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300">Thanh toán</button>
    <p className="text-sm text-gray-500">
      Một hoặc nhiều sản phẩm trong giỏ hàng của bạn yêu cầu tài khoản. 
      <a href="#" className="text-primary-700 underline hover:no-underline">Đăng nhập hoặc tạo tài khoản</a>.
    </p>
  </div>
</div>


    </div>
  </form>
</section>

    
  </div>
})