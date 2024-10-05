import { useState } from "react";
import { Funnel, MagnifyingGlass } from "@medusajs/icons";

// Định nghĩa kiểu dữ liệu cho các thuộc tính
type SortType = "Default" | "Popularity" | "Average rating" | "Newness" | "Price: Low to High" | "Price: High to Low";
type PriceType = "All" | "$0.00 - $50.00" | "$50.00 - $100.00" | "$100.00 - $150.00" | "$150.00 - $200.00" | "$200.00+";
type ColorType = "Black" | "Blue" | "Grey" | "Green" | "Red" | "White";
type TagType = "Fashion" | "Lifestyle" | "Denim" | "Streetstyle" | "Crafts";

const CardProduct: React.FC = () => {
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [selectedSort, setSelectedSort] = useState<SortType>("Default");
    const [selectedPrice, setSelectedPrice] = useState<PriceType>("All");
    const [selectedColor, setSelectedColor] = useState<ColorType | null>(null);
    const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
    const [showSearch, setShowSearch] = useState<boolean>(false);

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

    const toggleFilter = () => {
        setShowFilter(!showFilter);
        if (!showFilter) {
            setShowSearch(false); // Tắt Search khi Filter bật
        }
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setShowFilter(false); // Tắt Filter khi Search bật
        }
    };

    return (
        <>
            <div className="container mx-auto p-4 sm:p-8">
                <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8">PRODUCT OVERVIEW</h1>
                <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-8">
                    <div className="flex flex-wrap space-x-4 sm:space-x-8">
                        <a href="#" className="text-gray-900 border-b-2 border-gray-900">All Products</a>
                        <a href="#" className="text-gray-600">Women</a>
                        <a href="#" className="text-gray-600">Men</a>
                        <a href="#" className="text-gray-600">Bag</a>
                        <a href="#" className="text-gray-600">Shoes</a>
                        <a href="#" className="text-gray-600">Watches</a>
                    </div>
                    <div className="flex space-x-2 sm:space-x-4 mt-4 sm:mt-0">
                        <button
                            onClick={toggleFilter}
                            className="flex items-center border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 rounded"
                        >
                            <Funnel className="mr-1 sm:mr-2" /> {showFilter ? "Close" : "Filter"}
                        </button>
                        <button
                            onClick={toggleSearch}
                            className="flex items-center border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 rounded"
                        >
                            <MagnifyingGlass className="mr-1 sm:mr-2" /> {showSearch ? "Close" : "Search"}
                        </button>
                    </div>
                </div>

                {showSearch && (
                    <div className="mb-8 transition-all duration-500 ease-in-out transform scale-100 opacity-100">
                        <div className="border border-gray-300 p-4 rounded-lg flex items-center space-x-2">
                            <MagnifyingGlass className="mr-2" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full border-none focus:outline-none"
                            />
                        </div>
                    </div>
                )}

                <div
                    className={`transition-all duration-500 ease-in-out transform ${
                        showFilter ? "max-h-screen opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
                    } overflow-hidden`}
                >
                    {showFilter && (
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
                                                className={`cursor-pointer inline-block px-3 py-1 text-sm rounded-full ${
                                                    selectedTags.includes(tag as TagType) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                                }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                    <div className="text-center product-card relative group overflow-hidden">
                        <img src="https://placehold.co/300x400" alt="Esprit Ruffle Shirt" className="w-full transform transition-transform duration-500" />
                        <a href="#" className="quick-view absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow opacity-0 transition-all duration-900 group-hover:opacity-100 group-hover:translate-y-[-100px]">Quick View</a>
                        <h2 className="mt-4 text-gray-900">Esprit Ruffle Shirt</h2>
                        <p className="text-gray-600">$16.64</p>
                    </div>

                    {/* Thêm các sản phẩm khác ở đây */}
                </div>
            </div>
        </>
    );
}

export default CardProduct;
