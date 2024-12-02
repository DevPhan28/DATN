import instance from "@/api/axiosIntance";
import { Link } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  Funnel,
  MagnifyingGlass,
  ShoppingCartSolid,
  Heart as HeartIcon, // Renaming Heart to avoid name conflict
} from '@medusajs/icons';
import { toast } from "@medusajs/ui";

type SortType = "Default" | "Popularity" | "Average rating" | "Newness" | "Price: Low to High" | "Price: High to Low";
type PriceType = "All" | "$0.00 - $50.00" | "$50.00 - $100.00" | "$100.00 - $150.00" | "$150.00 - $200.00" | "$200.00+";
type ColorType = "Black" | "Blue" | "Grey" | "Green" | "Red" | "White";
type TagType = "Fashion" | "Lifestyle" | "Denim" | "Streetstyle" | "Crafts";
type SizeType = "S" | "M" | "L" | "XL" | "XXL" | "All";

const FilterBar: React.FC = () => {
  const [selectedSort, setSelectedSort] = useState<SortType>("Default");
  const [selectedPrice, setSelectedPrice] = useState<PriceType>("All");
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [selectedSize, setSelectedSize] = useState<SizeType>("All"); 
  const [products, setProducts] = useState<any[]>([]); 
  const [isFavorite, setIsFavorite] = useState(false);

  const priceRangeMapping: Record<PriceType, [number | null, number | null]> = {
    All: [null, null],
    "$0.00 - $50.00": [0, 50],
    "$50.00 - $100.00": [50, 100],
    "$100.00 - $150.00": [100, 150],
    "$150.00 - $200.00": [150, 200],
    "$200.00+": [200, null],
  };

  const fetchFilteredProducts = async () => {
    try {
      const [minPrice, maxPrice] = priceRangeMapping[selectedPrice];
      const params = new URLSearchParams();
  
      // Gửi tham số sort nếu không phải là Default
      if (selectedSort !== "Default") params.append("sort", selectedSort);
  
      // Gửi giá trị price nếu có giá trị cụ thể
      if (minPrice !== null) params.append("minPrice", minPrice.toString());
      if (maxPrice !== null) params.append("maxPrice", maxPrice.toString());
  
      // Gửi màu sắc nếu có giá trị
      if (selectedColor) params.append("color", selectedColor.toLowerCase());
  
      // Gửi các tag nếu có
      if (selectedTags.length > 0) params.append("tags", selectedTags.join(","));
  
      // Gửi size nếu không phải là "All"
      if (selectedSize !== "All") params.append("size", selectedSize);
  
      // Thêm các tham số phân trang
      params.append("limit", "10"); 
      params.append("page", "1");  

      const response = await instance.get(`/products/filter?${params.toString()}`);
  
      const filteredProducts = response.data.data;
      setProducts(filteredProducts); 

      // Show toast if no products are found
      if (filteredProducts.length === 0) {
        toast.error("Không tìm thấy sản phẩm đã lọc");
      }

    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const toggleFavorite = (productId: string) => {
    setIsFavorite(prevState => !prevState);
    // You can add additional logic here, such as saving the favorite status in the backend or localStorage
  };
  
  const toggleTag = (tag: TagType) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSort = (sort: SortType) => setSelectedSort(sort);
  const togglePrice = (price: PriceType) => setSelectedPrice(price);
  const toggleColor = (color: ColorType) => setSelectedColor(color);

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedSort, selectedPrice, selectedColor, selectedTags, selectedSize]);

  return (
    <div>
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Sort By */}
          <div>
            <h3 className="font-bold mb-2">Sort By</h3>
            <ul>
              {["Default", "Popularity", "Average rating", "Newness", "Price: Low to High", "Price: High to Low"].map((sort) => (
                <li
                  key={sort}
                  className={`cursor-pointer ${selectedSort === sort ? "text-blue-500 font-bold" : "text-gray-600"}`}
                  onClick={() => toggleSort(sort as SortType)}
                >
                  {sort}
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-bold mb-2">Price</h3>
            <ul>
              {["All", "$0.00 - $50.00", "$50.00 - $100.00", "$100.00 - $150.00", "$150.00 - $200.00", "$200.00+"].map((price) => (
                <li
                  key={price}
                  className={`cursor-pointer ${selectedPrice === price ? "text-blue-500 font-bold" : "text-gray-600"}`}
                  onClick={() => togglePrice(price as PriceType)}
                >
                  {price}
                </li>
              ))}
            </ul>
          </div>

          {/* Color */}
          <div>
            <h3 className="font-bold mb-2">Color</h3>
            <ul className="space-y-2">
              {[{ name: "Black", color: "bg-black" }, { name: "Blue", color: "bg-blue-500" }, { name: "Grey", color: "bg-gray-500" }, { name: "Green", color: "bg-green-500" }, { name: "Red", color: "bg-red-500" }, { name: "White", color: "bg-white border border-gray-300" }].map(({ name, color }) => (
                <li
                  key={name}
                  className={`flex items-center cursor-pointer space-x-2 ${selectedColor === name ? "font-bold" : ""}`}
                  onClick={() => toggleColor(name as ColorType)}
                >
                  <span className={`w-4 h-4 rounded-full ${color}`} style={{ display: "inline-block" }}></span>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Size */}
          <div>
            <h3 className="font-bold mb-2">Size</h3>
            <ul>
              {["All", "S", "M", "L", "XL", "XXL"].map((size) => (
                <li
                  key={size}
                  className={`cursor-pointer ${selectedSize === size ? "text-blue-500 font-bold" : "text-gray-600"}`}
                  onClick={() => setSelectedSize(size as SizeType)}
                >
                  {size}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-bold mb-2">Tags</h3>
            <div className="flex flex-wrap space-x-2">
              {["Fashion", "Lifestyle", "Denim", "Streetstyle", "Crafts"].map((tag) => (
                <span
                  key={tag}
                  onClick={() => toggleTag(tag as TagType)}
                  className={`cursor-pointer inline-block px-3 py-1 text-sm rounded-full ${selectedTags.includes(tag as TagType) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Display Products */}
      <div>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product: Product) => (
              <div key={product._id} className="product-card group relative overflow-hidden text-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-80 w-full transform transition-transform duration-500"
                />
                <Link
                  to={`${product.slug ? product.slug : product._id}/quickviewProduct`}
                  className="quick-view duration-900 absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-white px-4 py-2 opacity-0 shadow transition-all hover:bg-black hover:text-white group-hover:translate-y-[-100px] group-hover:opacity-100"
                >
                  View Details
                </Link>
                <h2 className="mt-2 flex items-center justify-between text-gray-500">
                  {product.name}
                  <div className="flex gap-1 space-x-2">
                    <Link
                      to={`/${product.slug ? product.slug : product._id}/detailproduct`}
                      className="hover:text-blue-300"
                    >
                      <ShoppingCartSolid />
                    </Link>
                    <button
                      onClick={() => toggleFavorite(product._id)}
                      className={`transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      <HeartIcon />
                    </button>
                  </div>
                </h2>
                <p className="mt-2 flex justify-start text-gray-600">
                  ${product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
