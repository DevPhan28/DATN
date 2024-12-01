import React from 'react'

const SearchBar = () => {
  return (
   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 js-hide-modal-search">
  <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
    {/* Close Button */}
    <button className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition js-hide-modal-search">
      <img src="https://themewagon.github.io/cozastore/images/icons/icon-close2.png" alt="Close" className="w-5 h-5" />
    </button>
    {/* Search Form */}
    <form className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md shadow-sm">
      <button className="p-2 text-gray-500 hover:text-gray-700 transition">
      <i className="fa-solid fa-magnifying-glass p-3 text-[20px] hover:text-blue-400"></i>
      </button>
      <input type="text" name="search" placeholder="Search..." className="w-full p-2 text-sm placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500" />
    </form>
  </div>
</div>

    
  )
}

export default SearchBar