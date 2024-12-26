import React from 'react'

const FeaturedProducts = () => {
  return (
    <div>
      <section className="products-carousel container px-[55px]">
        <h2 className="section-title text-uppercase text-center mb-4 pb-xl-2 mb-xl-4">Limited <strong>Edition</strong></h2>
        <div id="product_carousel" className="position-relative">
          <div className="swiper-container js-swiper-slider" data-settings="{
      &quot;autoplay&quot;: {
        &quot;delay&quot;: 5000
      },
      &quot;slidesPerView&quot;: 4,
      &quot;slidesPerGroup&quot;: 4,
      &quot;effect&quot;: &quot;none&quot;,
      &quot;loop&quot;: true,
      &quot;pagination&quot;: {
        &quot;el&quot;: &quot;#product_carousel .products-pagination&quot;,
        &quot;type&quot;: &quot;bullets&quot;,
        &quot;clickable&quot;: true
      },
      &quot;navigation&quot;: {
        &quot;nextEl&quot;: &quot;#product_carousel .products-carousel__next&quot;,
        &quot;prevEl&quot;: &quot;#product_carousel .products-carousel__prev&quot;
      },
      &quot;breakpoints&quot;: {
        &quot;320&quot;: {
          &quot;slidesPerView&quot;: 2,
          &quot;slidesPerGroup&quot;: 2,
          &quot;spaceBetween&quot;: 14
        },
        &quot;768&quot;: {
          &quot;slidesPerView&quot;: 3,
          &quot;slidesPerGroup&quot;: 3,
          &quot;spaceBetween&quot;: 24
        },
        &quot;992&quot;: {
          &quot;slidesPerView&quot;: 4,
          &quot;slidesPerGroup&quot;: 1,
          &quot;spaceBetween&quot;: 30
        }
      }
    }">
            <div className="swiper-wrapper">
              <div className="swiper-slide product-card">
                <div className="pc__img-wrapper">
                  <a href="product1_simple.html">
                    <img loading="lazy" src="https://picsum.photos/200/300" width={330} height={400} alt="Cropped Faux leather Jacket" className="pc__img" />
                  </a>
                  <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart">Add To Cart</button>
                </div>
                <div className="pc__info position-relative">
                  <p className="pc__category">Dresses</p>
                  <h6 className="pc__title"><a href="product1_simple.html">Hub Accent Mirror</a></h6>
                  <div className="product-card__price d-flex">
                    <span className="money price">$17</span>
                  </div>
                  <button className="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist" title="Add To Wishlist">
                    <svg width={16} height={16} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <use href="#icon_heart" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="swiper-slide product-card">
                <div className="pc__img-wrapper">
                  <a href="product1_simple.html">
                    <img loading="lazy" src="https://picsum.photos/200/300" width={330} height={400} alt="Cropped Faux leather Jacket" className="pc__img" />
                  </a>
                  <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart">Add To Cart</button>
                </div>
                <div className="pc__info position-relative">
                  <p className="pc__category">Dresses</p>
                  <h6 className="pc__title"><a href="product1_simple.html">Hosking Blue Area Rug</a></h6>
                  <div className="product-card__price d-flex">
                    <span className="money price">$29</span>
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
              <div className="swiper-slide product-card">
                <div className="pc__img-wrapper">
                  <a href="product1_simple.html">
                    <img loading="lazy" src="https://picsum.photos/200/300" width={330} height={400} alt="Cropped Faux leather Jacket" className="pc__img" />
                  </a>
                  <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart">Add To Cart</button>
                </div>
                <div className="pc__info position-relative">
                  <p className="pc__category">Dresses</p>
                  <h6 className="pc__title"><a href="product1_simple.html">Hanneman Pouf</a></h6>
                  <div className="product-card__price d-flex">
                    <span className="money price">$62</span>
                  </div>
                  <button className="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist" title="Add To Wishlist">
                    <svg width={16} height={16} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <use href="#icon_heart" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="swiper-slide product-card">
                <div className="pc__img-wrapper">
                  <a href="product1_simple.html">
                    <img loading="lazy" src="https://picsum.photos/200/300" width={330} height={400} alt="Cropped Faux leather Jacket" className="pc__img" />
                  </a>
                  <button className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside" data-aside="cartDrawer" title="Add To Cart">Add To Cart</button>
                </div>
                <div className="pc__info position-relative">
                  <p className="pc__category">Dresses</p>
                  <h6 className="pc__title"><a href="product1_simple.html">Cushion Futon Slipcover</a></h6>
                  <div className="product-card__price d-flex">
                    <span className="money price">$62</span>
                  </div>
                  <button className="pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist" title="Add To Wishlist">
                    <svg width={16} height={16} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <use href="#icon_heart" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>{/* /.swiper-wrapper */}
          </div>{/* /.swiper-container js-swiper-slider */}
          <div className="products-carousel__prev position-absolute top-50 d-flex align-items-center justify-content-center">
            <svg width={25} height={25} viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
              <use href="#icon_prev_md" />
            </svg>
          </div>{/* /.products-carousel__prev */}
          <div className="products-carousel__next position-absolute top-50 d-flex align-items-center justify-content-center">
            <svg width={25} height={25} viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
              <use href="#icon_next_md" />
            </svg>
          </div>{/* /.products-carousel__next */}
          <div className="products-pagination mt-4 mb-5 d-flex align-items-center justify-content-center" />
          {/* /.products-pagination */}
        </div>{/* /.position-relative */}
      </section>{/* /.products-carousel container */}
    </div>
  )
}

export default FeaturedProducts