const Footer = () => {
  return (
    <>
      <div className='bg-[#222222] text-white'>
        <div className="max-w-6xl m-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 py-16">
            <div className="mb-6">
              <h4 className="font-bold uppercase mb-5">Categories</h4>
              <p className="text-[#B2B2B2] text-sm mb-5">Women</p>
              <p className="text-[#B2B2B2] text-sm mb-5">Men</p>
              <p className="text-[#B2B2B2] text-sm mb-5">Shoes</p>
              <p className="text-[#B2B2B2] text-sm mb-5">Watches</p>
            </div>
            <div className="mb-6">
              <h4 className="font-bold uppercase mb-5">Help</h4>
              <p className="text-[#B2B2B2] text-sm mb-5">Track Order</p>
              <p className="text-[#B2B2B2] text-sm mb-5">Returns</p>
              <p className="text-[#B2B2B2] text-sm mb-5">Shipping</p>
              <p className="text-[#B2B2B2] text-sm mb-5">FAQs</p>
            </div>
            <div className="mb-6">
              <h4 className="font-bold uppercase mb-5">GET IN TOUCH</h4>
              <p className="text-[#B2B2B2] text-sm mb-5">
                Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018 or call us on (+1) 96 716 6879
              </p>
              <div className="flex space-x-8 text-[#B2B2B2] text-lg">
                <i className="fa-brands fa-facebook-f"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-twitter"></i>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2 uppercase">Newsletter</h4>
              <div>
                <div className='border-b'>
                  <input type="text" placeholder="email@example.com" className="p-2 focus:outline-none bg-transparent rounded-md w-full" />
                </div>
                <button className="bg-blue-400 text-white p-3 px-10 mt-5 rounded-3xl uppercase font-semibold hover:text-blue-400 hover:bg-white">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Footer;
