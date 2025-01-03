import React, { useState, useEffect } from 'react';
import {
  useFetchCategory,
  useFetchProductAll,
} from '@/data/products/useProductList';
import useCartMutation from '@/data/cart/useCartMutation';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Funnel,
  MagnifyingGlass,
  ShoppingCartSolid,
  Heart as HeartIcon,
} from '@medusajs/icons';
import FilterBar from './FilterBar';
import { toast } from '@medusajs/ui';
import CurrencyVND from './config/vnd';


const CardProduct: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const { addItemToCart } = useCartMutation();
  const navigate = useNavigate();

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    if (!showFilter) {
      setShowSearch(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setShowFilter(false);
    }
  };

  const { listProduct, loading, error } = useFetchProductAll();
  const { data: categories } = useFetchCategory();

  const handleAddToCart = (product: Product) => {
    const userId = localStorage.getItem('userId') ?? '';
    if (!userId) {
      console.error('User ID is missing');
      return;
    }

    addItemToCart.mutate({
      userId: userId,
      products: [
        {
          productId: product._id,
          variantId: product.variantId ?? '',
          quantity: 1,
        },
      ],
    });
  };

  useEffect(() => {
    const filterProducts = () => {
      let filtered = listProduct;

      // Lọc theo danh mục nếu có
      if (selectedCategory) {
        filtered = filtered.filter(
          product => product?.category?._id === selectedCategory
        );
      }

      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [selectedCategory, searchTerm, listProduct]);

  const displayedProducts =
    filteredProducts.length > 0
      ? filteredProducts.slice(0, 8)
      : listProduct.slice(0, 8);

  const handleFilterChange = (filtered: Product[]) => {
    setFilteredProducts(filtered);
    if (filtered.length > 0) {
      toast.success('Sản phẩm đã được lọc thành công!');
    } else {
      toast.error('Không tìm thấy sản phẩm phù hợp!');
    }
  };

  const toggleFavorite = (productId: string) => {
    setIsFavorite(prevState => !prevState);
  };

  return (
    <div>
      <section className="products-grid container px-[55px]">
        <h2 className="section-title text-uppercase text-center mb-1 mb-md-3 pb-xl-2 mb-xl-4"> <strong>Sản phẩm </strong>
          Hợp thời trang</h2>
        <ul className="nav nav-tabs mb-3 text-uppercase justify-content-center" id="collections-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <a onClick={() => setSelectedCategory(null)} className="nav-link nav-link_underscore active" id="collections-tab-1-trigger" data-bs-toggle="tab" href="#collections-tab-1" role="tab" aria-controls="collections-tab-1" aria-selected="true">Tất cả</a>
          </li>
          {categories?.map((category: { _id: string; name: string }) => (
            <li className="nav-item" role="presentation">
              <a key={category._id} onClick={e => {
                e.preventDefault();
                setSelectedCategory(category._id); // Gọi hàm để cập nhật danh mục
              }} className={`nav-link nav-link_underscore ${selectedCategory === category._id}`} id="collections-tab-2-trigger" data-bs-toggle="tab" href="#collections-tab-2" role="tab" aria-controls="collections-tab-2" aria-selected="true"> {category.name}</a>
            </li>
          ))}
        </ul>

        <div className="tab-content pt-2" id="collections-tab-content">
          {/* ALL */}
          <div className="tab-pane fade show active" id="collections-tab-1" role="tabpanel" aria-labelledby="collections-tab-1-trigger">
            {displayedProducts.length > 0 ? (
              <div className="row">
                {displayedProducts.map((product: Product) => (
                  <div className="col-6 col-md-4 col-lg-3">

                    <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                      <div className="pc__img-wrapper">
                        <a href={`${product.slug ? product.slug : product._id}/quickviewProduct`}>
                          <img
                            loading="lazy"
                            src={product.image}
                            width={330}
                            height={400}
                            alt="Cropped Faux leather Jacket"
                            className="pc__img"
                          />
                          <img
                            loading="lazy"
                            src={product.gallery[0]} // Dùng ảnh đầu tiên từ gallery
                            width={330}
                            height={400}
                            alt="Cropped Faux leather Jacket"
                            className="pc__img pc__img-second"
                          />
                        </a>
                        <Link to={`${product.slug ? product.slug : product._id}/quickviewProduct`}>
                          <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium" data-aside="cartDrawer" title="Add To Cart">Chi Tiết</button>
                        </Link>
                      </div>
                      <div className="pc__info position-relative">
                        {/* <p className="pc__category">Dresses</p> */}

                        <div className="flex justify-between">
                          <h6 className="pc__title"><a href={`${product.slug ? product.slug : product._id}/quickviewProduct`}> {product.name}</a></h6>

                          <div className='product-card__price d-flex'>
                            <Link
                              to={`/${product.slug ? product.slug : product._id}/detailproduct`}
                              className="hover:text-blue-300"
                            >
                              <ShoppingCartSolid />
                            </Link>
                          </div>
                        </div>
                        <div className="product-card__price d-flex">
                          <span className="money price"> <CurrencyVND amount={product.price} /></span>

                        </div>
                        <div className="product-card__review d-flex align-items-center">
                          <div className="reviews-group d-flex">
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                          </div>
                          {/* <span className="reviews-note text-lowercase text-secondary ms-1">8k+ reviews</span> */}
                        </div>
                        <button className="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist" title="Add To Wishlist">
                          <svg width={16} height={16} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <use href="#icon_heart" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                ))
                }

              </div>
            ) : (
              !loading && <p>No products found.</p>
            )}
            <div className="text-center mt-2">
              <a className="btn-link btn-link_lg default-underline text-uppercase fw-medium" href="shop1.html">Discover
                More</a>
            </div>
          </div>{/* /.tab-pane fade show*/}
          <div className="tab-pane fade show" id="collections-tab-2" role="tabpanel" aria-labelledby="collections-tab-2-trigger">
            {displayedProducts.length > 0 ? (
              <div className="row">
                {displayedProducts.map((product: Product) => (
                  <div className="col-6 col-md-4 col-lg-3">

                    <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                      <div className="pc__img-wrapper">
                        <a href="product1_simple.html">
                          <img
                            loading="lazy"
                            src={product.image}
                            width={330}
                            height={400}
                            alt="Cropped Faux leather Jacket"
                            className="pc__img"
                          />
                          <img
                            loading="lazy"
                            src={product.gallery[0]} // Dùng ảnh đầu tiên từ gallery
                            width={330}
                            height={400}
                            alt="Cropped Faux leather Jacket"
                            className="pc__img pc__img-second"
                          />
                        </a>

                        <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart">Add To Cart</button>
                      </div>
                      <div className="pc__info position-relative">
                        {/* <p className="pc__category">Dresses</p> */}
                        <h6 className="pc__title"><a href="product1_simple.html"> {product.name}</a></h6>
                        <div className="product-card__price d-flex">
                          <span className="money price"> <CurrencyVND amount={product.price} /></span>
                        </div>
                        <div className="product-card__review d-flex align-items-center">
                          <div className="reviews-group d-flex">
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                            <svg className="review-star" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                              <use href="#icon_star" />
                            </svg>
                          </div>
                          <span className="reviews-note text-lowercase text-secondary ms-1">8k+ reviews</span>
                        </div>
                        <button className="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist" title="Add To Wishlist">
                          <svg width={16} height={16} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <use href="#icon_heart" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                ))
                }

              </div>
            ) : (
              !loading && <p>No products found.</p>
            )}
            <div className="text-center mt-2">
              <a className="btn-link btn-link_lg default-underline text-uppercase fw-medium" href="shop1.html">Discover
                More</a>
            </div>
          </div>{/* /.tab-pane fade show*/}
        </div>{/* /.tab-content pt-2 */}
      </section>{/* /.products-grid */}
      <div className="mb-3 mb-xl-5 pb-1 pb-xl-5" />
    </div>
  );
};

export default CardProduct;
