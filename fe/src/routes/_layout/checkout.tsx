import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/checkout')({
  component: Checkout,
})
function Checkout() {
  return (
    <div className="max-w-6xl m-auto">
      <div className="p-2 mt-5">
        <div className="flex md:max-w-3xl w-full">
          <div className="flex-none w-14 ...">
            Home
          </div>
          <div className="flex-initial w-7 ...">
            <i className="fa-solid fa-chevron-right"></i>
          </div>
          <div className="flex-initial  text-gray-500">
            Shoping Cart
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col md:flex-row mt-10 gap-8 md:gap-12 lg:gap-16">
          <div className='flex-none w-full md:w-[60%]'>
            <div className="flex justify-evenly border border-slate-300 py-2 md:max-w-3xl w-full items-center">
              <div className="flex-initial w-72 text-center font-bold uppercase text-gray-600 px-4">
                product
              </div>
              <div className="flex-grow text-center font-bold uppercase text-gray-600 px-4">
                price
              </div>
              <div className="flex-grow text-center font-bold uppercase text-gray-600 px-4">
                quantity
              </div>
              <div className="flex-grow text-center font-bold uppercase text-gray-600 px-4">
                total
              </div>
            </div>
            {/* viết hàm map ở đây */}
            <div className="border-l border-r border-b border-slate-300 md:max-w-3xl w-full">
              <div className='flex justify-around items-center p-4'>
                <div className='flex items-center gap-4'>
                  <img src="https://picsum.photos/200/300" alt="Fresh Strawberries" className="w-16 h-auto" />
                  <div>
                    Fresh Strawberries
                  </div>
                </div>
                <div className='text-lg'>
                  $ 36.00
                </div>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button className="flex-1 py-2 px-4 border-r hover:bg-blue-400">-</button>
                  <div className="flex-1 py-2 text-center">0</div>
                  <button className="flex-1 py-2 px-4 border-l hover:bg-blue-400">+</button>
                </div>
                <div className='text-lg text-center'>
                  $ 36.00
                </div>
              </div>
            </div>
            <div className="border-l border-r border-b border-slate-300 md:max-w-3xl w-full">
              <div className='flex justify-around items-center p-4'>
                <div className='flex items-center gap-4'>
                  <img src="https://picsum.photos/200/300" alt="Fresh Strawberries" className="w-16 h-auto" />
                  <div>
                    Fresh Strawberries
                  </div>
                </div>
                <div className='text-lg'>
                  $ 36.00
                </div>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button className="flex-1 py-2 px-4 border-r hover:bg-blue-400">-</button>
                  <div className="flex-1 py-2 text-center">0</div>
                  <button className="flex-1 py-2 px-4 border-l hover:bg-blue-400">+</button>
                </div>
                <div className='text-lg text-center'>
                  $ 36.00
                </div>
              </div>
            </div>
            <div className="border-l border-r border-b border-slate-300 md:max-w-3xl w-full">
              <div className="flex flex-wrap justify-around items-center p-4 gap-4">
                <div className="flex-none">
                  <div className="p-2 border border-gray-400 rounded-2xl">
                    <input type="text" placeholder="Coupon Code" className="focus:outline-none w-full" />
                  </div>
                </div>
                <div className="flex-none">
                  <button className='px-6 py-2 border border-gray-300 rounded-2xl bg-gray-100 hover:bg-blue-400'>Apply coupon</button>
                </div>
                <div className="flex-none">
                  <button className='px-6 py-2 border border-gray-300 rounded-2xl bg-gray-100 hover:bg-blue-400'>Update Cart</button>
                </div>
              </div>
            </div>

          </div>
          <div className=' p-10 w-full md:w-[40%] lg:max-w-lg border border-gray-300'>
            <div className="w-full">
              <h2 className='uppercase font-bold text-xl'>Cart Totals</h2>
              <div className="flex items-center mt-5">
                <div className='w-32 flex-none font-medium'>Subtotal:</div>
                <div className="flex-none text-lg">$79.65</div>
              </div>
              <hr className="mt-3 border border-gray-300" />
              <div className="flex mt-5">
                <div className='w-32 flex-none font-medium'>Shipping:</div>
                <div className="text-[13px]">
                  <p className='text-gray-400'>There are no shipping methods available. Please double check your address, or contact us if you need any help.</p>
                  <div className="uppercase mt-3 text-gray-500">Calculate Shipping</div>
                  <div className="p-2 border border-gray-400 mt-3">
                    <select className='w-full focus:outline-none text-gray-500'>
                      <option value="">Select a country...</option>
                      <option value="">USA</option>
                      <option value="">UK</option>
                    </select>
                  </div>
                  <div className="p-2 border border-gray-400 mt-3">
                    <input type="text" placeholder='State/ country' className='w-full placeholder:text-gray-500 focus:outline-none' />
                  </div>
                  <div className="p-2 border border-gray-400 mt-3">
                    <input type="text" placeholder='Postcode/ Zip' className='w-full placeholder:text-gray-500 focus:outline-none' />
                  </div>
                  <div className="flex-none mt-3">
                    <button className='p-3 w-full border border-gray-300 uppercase text-sm font-bold rounded-2xl bg-gray-100 hover:bg-blue-400'>Update Totals</button>
                  </div>
                </div>
              </div>
              <hr className="mt-10 border border-gray-300" />
              <div className="flex items-center mt-5">
                <div className='w-32 flex-none font-bold text-xl'>Total:</div>
                <div className="flex-none text-xl">$79.65</div>
              </div>
              <div className="flex-none mt-5">
                <button className='p-4 w-full border border-gray-300 uppercase text-lg text-white font-bold rounded-3xl text-[15px] bg-black hover:bg-blue-400'>Proceed to Checkout</button>
              </div>
            </div>
          </div>

        </div>
      </div>


    </div>

  )
}