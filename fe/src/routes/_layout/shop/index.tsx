import CurrencyVND from '@/components/config/vnd';
import useCartMutation from '@/data/cart/useCartMutation';
import {
  useFetchCategory,
  useFetchProductAll,
} from '@/data/products/useProductList';
import {
  StarSolid
} from '@medusajs/icons';
import { toast } from '@medusajs/ui';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import anhbanershop from '../../../assets/images/shop/shop_banner_character1.png';
import instance from '@/api/axiosIntance';
export const Route = createFileRoute('/_layout/shop/')({
  component: Shop,
});

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Thêm trạng thái để theo dõi danh mục được chọn
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { addItemToCart } = useCartMutation();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [product, setProduct] = useState(null);
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

  const { listProduct, loading, error } = useFetchProductAll();
  const { data: categories } = useFetchCategory(); // Lấy danh mục từ API

  const handleAddToCart = (product: Product) => {
    const userId = localStorage.getItem('userId') ?? ''; // Xử lý userId có thể là null
    if (!userId) {
      console.error('User ID is missing');
      return; // Ngăn hành động nếu không có userId
    }

    addItemToCart.mutate({
      userId: userId,
      products: [
        {
          productId: product._id,
          variantId: product.variantId ?? '',
          quantity: 1,
        },
      ], // variantId được thêm nếu có
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
  useEffect(() => {
    if (listProduct) {
      const fetchComments = async () => {
        try {
          const response = await instance.get(
            `/comments/product/${listProduct._id}`
          );
          setComments(response.data);
          const totalRating = response.data.reduce(
            (sum, comment) => sum + comment.rating,
            0
          );
          const average = totalRating / response.data.length;
          setAverageRating(average); // Cập nhật số sao trung bình
        } catch (err) { }
      };
      fetchComments();
    }
  }, [listProduct]);
  console.log(listProduct);


  return (
    <div>
      <main>
        <div>
          <section className="full-width_padding">
            <div className="full-width_border border-2" style={{ borderColor: '#eeeeee' }}>
              <div className="shop-banner position-relative ">
                <div className="background-img" style={{ backgroundColor: '#eeeeee' }}>
                  <img loading="lazy" src={anhbanershop} width={1759} height={420} alt="Pattern" className="slideshow-bg__img object-fit-cover" />
                </div>
                <div className="shop-banner__content container position-absolute start-50 top-50 translate-middle">
                  <h2 className="stroke-text h1 smooth-16 text-uppercase fw-bold mb-3 mb-xl-4 mb-xl-5">Jackets &amp; Coats</h2>
                  <ul className="d-flex flex-wrap list-unstyled text-uppercase h6">
                    <li onClick={() => setSelectedCategory(null)} className="me-3 me-xl-4 pe-1"><a href="#" className="menu-link menu-link_us-s menu-link_active">Tất Cả</a></li>
                    {categories?.map((category: { _id: string; name: string }) => (
                      <li key={category._id} onClick={e => {
                        e.preventDefault();
                        setSelectedCategory(category._id); // Gọi hàm để cập nhật danh mục
                      }} className={`me-3 me-xl-4 pe-1${selectedCategory === category._id ? 'border-b-2' : ''}`}><a href="#" className="menu-link menu-link_us-s">{category.name}</a></li>
                    ))}
                  </ul>
                </div>{/* /.shop-banner__content */}
              </div>{/* /.shop-banner position-relative */}
            </div>{/* /.full-width_border */}
          </section>{/* /.full-width_padding*/}
          <div className="mb-4 pb-lg-3" />
        </div>

        <section className="shop-main container d-flex px-[55px]">
          <div className="shop-sidebar side-sticky bg-body" id="shopFilter">

            <div className="accordion" id="categories-list">
              <div className="accordion-item mb-4 pb-3">
                <h5 className="accordion-header" id="accordion-heading-11">
                  <button className="accordion-button p-0 border-0 fs-5 text-uppercase" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-filter-1" aria-expanded="true" aria-controls="accordion-filter-1">
                    Product Categories
                    <svg className="accordion-button__icon type2" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                      <g aria-hidden="true" stroke="none" fillRule="evenodd">
                        <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                      </g>
                    </svg>
                  </button>
                </h5>
                <div id="accordion-filter-1" className="accordion-collapse  show border-0" aria-labelledby="accordion-heading-11" data-bs-parent="#categories-list">
                  <div className="accordion-body px-0 pb-0 pt-3">
                    <ul className="list list-inline mb-0">
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">Dresses</a>
                      </li>
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">Shorts</a>
                      </li>
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">Sweatshirts</a>
                      </li>
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">Swimwear</a>
                      </li>
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">Jackets</a>
                      </li>
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">T-Shirts &amp; Tops</a>
                      </li>
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">Jeans</a>
                      </li>
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">Trousers</a>
                      </li>
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">Men</a>
                      </li>
                      <li className="list-item">
                        <a href="#" className="menu-link py-1">Jumpers &amp; Cardigans</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>{/* /.accordion-item */}
            </div>{/* /.accordion-item */}
            <div className="accordion" id="color-filters">
              <div className="accordion-item mb-4 pb-3">
                <h5 className="accordion-header" id="accordion-heading-1">
                  <button className="accordion-button p-0 border-0 fs-5 text-uppercase" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-filter-2" aria-expanded="true" aria-controls="accordion-filter-2">
                    Color
                    <svg className="accordion-button__icon type2" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                      <g aria-hidden="true" stroke="none" fillRule="evenodd">
                        <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                      </g>
                    </svg>
                  </button>
                </h5>
                <div id="accordion-filter-2" className="accordion-collapse  show border-0" aria-labelledby="accordion-heading-1" data-bs-parent="#color-filters">
                  <div className="accordion-body px-0 pb-0">
                    <div className="d-flex flex-wrap">
                      <a href="#" className="swatch-color js-filter" style={{ color: '#0a2472' }} />
                      <a href="#" className="swatch-color js-filter" style={{ color: '#d7bb4f' }} />
                      <a href="#" className="swatch-color js-filter" style={{ color: '#282828' }} />
                      <a href="#" className="swatch-color js-filter" style={{ color: '#b1d6e8' }} />
                      <a href="#" className="swatch-color js-filter" style={{ color: '#9c7539' }} />
                      <a href="#" className="swatch-color js-filter" style={{ color: '#d29b48' }} />
                      <a href="#" className="swatch-color js-filter" style={{ color: '#e6ae95' }} />
                      <a href="#" className="swatch-color js-filter" style={{ color: '#d76b67' }} />
                      <a href="#" className="swatch-color swatch_active js-filter" style={{ color: '#bababa' }} />
                      <a href="#" className="swatch-color js-filter" style={{ color: '#bfdcc4' }} />
                    </div>
                  </div>
                </div>
              </div>{/* /.accordion-item */}
            </div>{/* /.accordion */}
            <div className="accordion" id="size-filters">
              <div className="accordion-item mb-4 pb-3">
                <h5 className="accordion-header" id="accordion-heading-size">
                  <button className="accordion-button p-0 border-0 fs-5 text-uppercase" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-filter-size" aria-expanded="true" aria-controls="accordion-filter-size">
                    Sizes
                    <svg className="accordion-button__icon type2" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                      <g aria-hidden="true" stroke="none" fillRule="evenodd">
                        <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                      </g>
                    </svg>
                  </button>
                </h5>
                <div id="accordion-filter-size" className="accordion-collapse  show border-0" aria-labelledby="accordion-heading-size" data-bs-parent="#size-filters">
                  <div className="accordion-body px-0 pb-0">
                    <div className="d-flex flex-wrap">
                      <a href="#" className="swatch-size btn btn-sm btn-outline-light mb-3 me-3 js-filter">XS</a>
                      <a href="#" className="swatch-size btn btn-sm btn-outline-light mb-3 me-3 js-filter">S</a>
                      <a href="#" className="swatch-size btn btn-sm btn-outline-light mb-3 me-3 js-filter">M</a>
                      <a href="#" className="swatch-size btn btn-sm btn-outline-light mb-3 me-3 js-filter">L</a>
                      <a href="#" className="swatch-size btn btn-sm btn-outline-light mb-3 me-3 js-filter">XL</a>
                      <a href="#" className="swatch-size btn btn-sm btn-outline-light mb-3 me-3 js-filter">XXL</a>
                    </div>
                  </div>
                </div>
              </div>{/* /.accordion-item */}
            </div>{/* /.accordion */}
            <div className="accordion" id="brand-filters">
              <div className="accordion-item mb-4 pb-3">
                <h5 className="accordion-header" id="accordion-heading-brand">
                  <button className="accordion-button p-0 border-0 fs-5 text-uppercase" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-filter-brand" aria-expanded="true" aria-controls="accordion-filter-brand">
                    Brands
                    <svg className="accordion-button__icon type2" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                      <g aria-hidden="true" stroke="none" fillRule="evenodd">
                        <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                      </g>
                    </svg>
                  </button>
                </h5>
                <div id="accordion-filter-brand" className="accordion-collapse  show border-0" aria-labelledby="accordion-heading-brand" data-bs-parent="#brand-filters">
                  <div className="search-field multi-select accordion-body px-0 pb-0">
                    <select className="d-none" multiple name="total-numbers-list">
                      <option value={1}>Adidas</option>
                      <option value={2}>Balmain</option>
                      <option value={3}>Balenciaga</option>
                      <option value={4}>Burberry</option>
                      <option value={5}>Kenzo</option>
                      <option value={5}>Givenchy</option>
                      <option value={5}>Zara</option>
                    </select>
                    <div className="search-field__input-wrapper mb-3">
                      <input type="text" name="search_text" className="search-field__input form-control form-control-sm border-light border-2" placeholder="SEARCH" />
                    </div>
                    <ul className="multi-select__list list-unstyled">
                      <li className="search-suggestion__item multi-select__item text-primary js-search-select js-multi-select">
                        <span className="me-auto">Adidas</span>
                        <span className="text-secondary">2</span>
                      </li>
                      <li className="search-suggestion__item multi-select__item text-primary js-search-select js-multi-select">
                        <span className="me-auto">Balmain</span>
                        <span className="text-secondary">7</span>
                      </li>
                      <li className="search-suggestion__item multi-select__item text-primary js-search-select js-multi-select">
                        <span className="me-auto">Balenciaga</span>
                        <span className="text-secondary">10</span>
                      </li>
                      <li className="search-suggestion__item multi-select__item text-primary js-search-select js-multi-select">
                        <span className="me-auto">Burberry</span>
                        <span className="text-secondary">39</span>
                      </li>
                      <li className="search-suggestion__item multi-select__item text-primary js-search-select js-multi-select">
                        <span className="me-auto">Kenzo</span>
                        <span className="text-secondary">95</span>
                      </li>
                      <li className="search-suggestion__item multi-select__item text-primary js-search-select js-multi-select">
                        <span className="me-auto">Givenchy</span>
                        <span className="text-secondary">1092</span>
                      </li>
                      <li className="search-suggestion__item multi-select__item text-primary js-search-select js-multi-select">
                        <span className="me-auto">Zara</span>
                        <span className="text-secondary">48</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>{/* /.accordion-item */}
            </div>{/* /.accordion */}
            <div className="accordion" id="price-filters">
              <div className="accordion-item mb-4">
                <h5 className="accordion-header mb-2" id="accordion-heading-price">
                  <button className="accordion-button p-0 border-0 fs-5 text-uppercase" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-filter-price" aria-expanded="true" aria-controls="accordion-filter-price">
                    Price
                    <svg className="accordion-button__icon type2" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                      <g aria-hidden="true" stroke="none" fillRule="evenodd">
                        <path d="M5.35668 0.159286C5.16235 -0.053094 4.83769 -0.0530941 4.64287 0.159286L0.147611 5.05963C-0.0492049 5.27473 -0.049205 5.62357 0.147611 5.83813C0.344427 6.05323 0.664108 6.05323 0.860924 5.83813L5 1.32706L9.13858 5.83867C9.33589 6.05378 9.65507 6.05378 9.85239 5.83867C10.0492 5.62357 10.0492 5.27473 9.85239 5.06018L5.35668 0.159286Z" />
                      </g>
                    </svg>
                  </button>
                </h5>
                <div id="accordion-filter-price" className="accordion-collapse  show border-0" aria-labelledby="accordion-heading-price" data-bs-parent="#price-filters">
                  <input className="price-range-slider" type="text" name="price_range" data-slider-min={10} data-slider-max={1000} data-slider-step={5} data-slider-value="[250,450]" data-currency="$" />
                  <div className="price-range__info d-flex align-items-center mt-2">
                    <div className="me-auto">
                      <span className="text-secondary">Min Price: </span>
                      <span className="price-range__min">$250</span>
                    </div>
                    <div>
                      <span className="text-secondary">Max Price: </span>
                      <span className="price-range__max">$450</span>
                    </div>
                  </div>
                </div>
              </div>{/* /.accordion-item */}
            </div>{/* /.accordion */}
          </div>{/* /.shop-sidebar */}
          <div className="shop-list flex-grow-1">
            <div className="d-flex justify-content-between mb-4 pb-md-2">
              <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
                <a href="#" className="menu-link menu-link_us-s text-uppercase fw-medium">Home</a>
                <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">/</span>
                <a href="#" className="menu-link menu-link_us-s text-uppercase fw-medium">The Shop</a>
              </div>{/* /.breadcrumb */}
              <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
                <select className="shop-acs__select form-select w-auto border-0 py-0 order-1 order-md-0" aria-label="Sort Items" name="total-number">
                  <option selected>Default Sorting</option>
                  <option value={1}>Featured</option>
                  <option value={2}>Best selling</option>
                  <option value={3}>Alphabetically, A-Z</option>
                  <option value={3}>Alphabetically, Z-A</option>
                  <option value={3}>Price, low to high</option>
                  <option value={3}>Price, high to low</option>
                  <option value={3}>Date, old to new</option>
                  <option value={3}>Date, new to old</option>
                </select>
                <div className="shop-asc__seprator mx-3 bg-light d-none d-md-block order-md-0" />
                <div className="col-size align-items-center order-1 d-none d-lg-flex">
                  <span className="text-uppercase fw-medium me-2">View</span>
                  <button className="btn-link fw-medium me-2 js-cols-size" data-target="products-grid" data-cols={2}>2</button>
                  <button className="btn-link fw-medium me-2 js-cols-size" data-target="products-grid" data-cols={3}>3</button>
                  <button className="btn-link fw-medium js-cols-size" data-target="products-grid" data-cols={4}>4</button>
                </div>{/* /.col-size */}
                <div className="shop-filter d-flex align-items-center order-0 order-md-3 d-lg-none">
                  <button className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside" data-aside="shopFilter">
                    <svg className="d-inline-block align-middle me-2" width={14} height={10} viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#icon_filter" /></svg>
                    <span className="text-uppercase fw-medium d-inline-block align-middle">Filter</span>
                  </button>
                </div>{/* /.col-size d-flex align-items-center ms-auto ms-md-3 */}
              </div>{/* /.shop-acs */}
            </div>{/* /.d-flex justify-content-between */}
            <div className="products-grid row row-cols-2 row-cols-md-3" id="products-grid">
              {displayedProducts.map((product: Product) => (
                <div className="product-card-wrapper">

                  <div className="product-card mb-3 mb-md-4 mb-xxl-5">
                    <div className="pc__img-wrapper">
                      <div className="">
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

                      </div>
                      <Link to={`/${product.slug ? product.slug : product._id}/quickviewProduct`}>
                        <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium" data-aside="cartDrawer" title="Add To Cart">Chi Tiết</button>
                      </Link>
                    </div>
                    <div className="pc__info position-relative">

                      <h6 className="pc__title capitalize">
                        <a href={`${product.slug ? product.slug : product._id}/quickviewProduct`}>{product.name}</a>
                      </h6>

                      <div className="product-card__price d-flex">
                        <span className="money price"><CurrencyVND amount={product.price} /></span>
                      </div>
                      <div className="product-card__review d-flex align-items-center">
                        <div className="reviews-group d-flex">
                          {[...Array(5)].map((_, index) => (
                            <StarSolid
                              key={index}
                              className={`h-5 w-5 ${index < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="font-semibold">
                            {averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="reviews-note text-lowercase text-secondary ms-1">8k+ reviews</span>
                      </div>

                    </div>
                  </div>

                </div>
              ))}

            </div>{/* /.products-grid row */}
            <nav className="shop-pages d-flex justify-content-between mt-3" aria-label="Page navigation">
              <a href="#" className="btn-link d-inline-flex align-items-center">
                <svg className="me-1" width={7} height={11} viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_prev_sm" /></svg>
                <span className="fw-medium">PREV</span>
              </a>
              <ul className="pagination mb-0">
                <li className="page-item"><a className="btn-link px-1 mx-2 btn-link_active" href="#">1</a></li>
                <li className="page-item"><a className="btn-link px-1 mx-2" href="#">2</a></li>
                <li className="page-item"><a className="btn-link px-1 mx-2" href="#">3</a></li>
                <li className="page-item"><a className="btn-link px-1 mx-2" href="#">4</a></li>
              </ul>
              <a href="#" className="btn-link d-inline-flex align-items-center">
                <span className="fw-medium me-1">NEXT</span>
                <svg width={7} height={11} viewBox="0 0 7 11" xmlns="http://www.w3.org/2000/svg"><use href="#icon_next_sm" /></svg>
              </a>
            </nav>
          </div>
        </section>{/* /.shop-main container */}
      </main>
      <div className="mb-5 pb-xl-5" />
    </div>
  );
}
