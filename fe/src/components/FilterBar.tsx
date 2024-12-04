import instance from "@/api/axiosIntance";
import React, { useState, useEffect } from "react";
import { toast } from "@medusajs/ui";

// Các kiểu dữ liệu cho các lựa chọn lọc
type SortType = "Default" | "Popularity" | "Average rating" | "Newness" | "Price: Low to High" | "Price: High to Low";
type PriceType = "All" | "0₫ - 100000₫" | "100000₫ - 200000₫" | "200000₫ - 300000₫" | "300000₫ - 400000₫" | "400000₫+";
type ColorType = "Black" | "Blue" | "Grey" | "Green" | "Red" | "White";
type TagType = "Fashion" | "Lifestyle" | "Denim" | "Streetstyle" | "Crafts";
type SizeType = "S" | "M" | "L" | "XL" | "XXL" | "All";

const FilterBar: React.FC<{ onFilterChange: (products: any[]) => void }> = ({ onFilterChange }) => {
  const [selectedSort, setSelectedSort] = useState<SortType>("Default");
  const [selectedPrice, setSelectedPrice] = useState<PriceType>("All");
  const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [selectedSize, setSelectedSize] = useState<SizeType>("All");

  // Cập nhật giá từ triệu sang trăm nghìn
  const priceRangeMapping: Record<PriceType, [number | null, number | null]> = {
    All: [null, null],
    "0₫ - 100000₫": [0, 100000],
    "100000₫ - 200000₫": [100000, 200000],
    "200000₫ - 300000₫": [200000, 300000],
    "300000₫ - 400000₫": [300000, 400000],
    "400000₫+": [400000, null],
  };

  // Hàm lấy sản phẩm đã lọc
  const fetchFilteredProducts = async () => {
    try {
      const [minPrice, maxPrice] = priceRangeMapping[selectedPrice];
      const params = new URLSearchParams();

      // Thêm các tham số lọc vào params
      if (selectedSort !== "Default") params.append("sort", selectedSort);
      if (minPrice !== null) params.append("minPrice", minPrice.toString());
      if (maxPrice !== null) params.append("maxPrice", maxPrice.toString());
      if (selectedColor) params.append("color", selectedColor.toLowerCase());
      if (selectedTags.length > 0) params.append("tags", selectedTags.join(","));
      if (selectedSize !== "All") params.append("size", selectedSize);

      // Thêm tham số phân trang
      params.append("limit", "10");
      params.append("page", "1");

      // Gọi API để lấy sản phẩm đã lọc
      const response = await instance.get(`/products/filter?${params.toString()}`);

      const filteredProducts = response.data.data;
      console.log("Filtered Products:", filteredProducts);  // Log dữ liệu sản phẩm đã lọc

      // Truyền kết quả lọc cho component cha
      onFilterChange(filteredProducts);

      // Hiển thị thông báo nếu không tìm thấy sản phẩm
      if (filteredProducts.length === 0) {
        toast.error("Không tìm thấy sản phẩm đã lọc");
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  // Các hàm để thay đổi các lựa chọn lọc
  const toggleSort = (sort: SortType) => setSelectedSort(sort);
  const togglePrice = (price: PriceType) => setSelectedPrice(price);
  const toggleColor = (color: ColorType) => setSelectedColor(color);
  const toggleTag = (tag: TagType) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Gọi hàm lọc khi các lựa chọn thay đổi
  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedSort, selectedPrice, selectedColor, selectedTags, selectedSize]);

  return (
    <div>
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Phần lựa chọn sắp xếp */}
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

          {/* Phần lựa chọn giá */}
          <div>
            <h3 className="font-bold mb-2">Price</h3>
            <ul>
              {["All", "0₫ - 100000₫", "100000₫ - 200000₫", "200000₫ - 300000₫", "300000₫ - 400000₫", "400000₫+"].map((price) => (
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

          {/* Phần lựa chọn màu */}
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

          {/* Phần lựa chọn size */}
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

          {/* Phần lựa chọn tag */}
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
    </div>
  );
};

export default FilterBar;
