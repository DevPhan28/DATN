import React, { useState } from "react";

// Định nghĩa kiểu dữ liệu cho các thuộc tính
type SortType = "Default" | "Popularity" | "Average rating" | "Newness" | "Price: Low to High" | "Price: High to Low";
type PriceType = "All" | "$0.00 - $50.00" | "$50.00 - $100.00" | "$100.00 - $150.00" | "$150.00 - $200.00" | "$200.00+";
type ColorType = "Black" | "Blue" | "Grey" | "Green" | "Red" | "White";
type TagType = "Fashion" | "Lifestyle" | "Denim" | "Streetstyle" | "Crafts";

const FilterBar: React.FC = () => {
    const [selectedSort, setSelectedSort] = useState<SortType>("Default");
    const [selectedPrice, setSelectedPrice] = useState<PriceType>("All");
    const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);
    const [selectedTags, setSelectedTags] = useState<TagType[]>([]);

    const toggleTag = (tag: TagType) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter((t) => t !== tag)
                : [...prevSelectedTags, tag]
        );
    };

    const toggleSort = (sort: SortType) => {
        setSelectedSort(sort);
    };

    const togglePrice = (price: PriceType) => {
        setSelectedPrice(price);
    };

    const toggleColor = (color: ColorType) => {
        setSelectedColor(color);
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                        {[
                            { name: "Black", color: "bg-black" },
                            { name: "Blue", color: "bg-blue-500" },
                            { name: "Grey", color: "bg-gray-500" },
                            { name: "Green", color: "bg-green-500" },
                            { name: "Red", color: "bg-red-500" },
                            { name: "White", color: "bg-white border border-gray-300" },
                        ].map(({ name, color }) => (
                            <li
                                key={name}
                                className={`flex items-center cursor-pointer space-x-2 ${selectedColor === name ? "font-bold" : ""}`}
                                onClick={() => toggleColor(name as ColorType)}
                            >
                                <span
                                    className={`w-4 h-4 rounded-full ${color}`}
                                    style={{ display: "inline-block" }}
                                ></span>
                                <span>{name}</span>
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
                                className={`cursor-pointer inline-block px-3 py-1 text-sm rounded-full ${selectedTags.includes(tag as TagType) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
