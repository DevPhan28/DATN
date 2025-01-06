import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import slide1 from '../assets/images/slider1.jpg';
import slide2 from '../assets/images/slider2.jpg';
import slide3 from '../assets/images/slider3.jpg';
const Slides = () => {
    return (
        <div className="px-[55px]">
            <section className="swiper-container slideshow full-width_padding ">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    autoplay={{ delay: 5000 }}
                    slidesPerView={1}
                    effect="fade"
                    loop={true}
                    pagination={{ el: ".slideshow-pagination", clickable: true }}
                    className="swiper-wrapper"
                >
                    {/* Slide 1 */}
                    <SwiperSlide className="swiper-slide full-width_border border-1 " style={{ borderColor: "#f5e6e0" }}>
                        <div className="overflow-hidden position-relative h-100">
                            <div className="slideshow-bg" style={{ backgroundColor: "#f5e6e0" }}>
                                <img
                                    loading="lazy"
                                    src={slide1}
                                    width={1761}
                                    height={778}
                                    alt="Pattern"
                                    className="slideshow-bg__img object-fit-cover"
                                />
                            </div>

                            <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
                                <h6 className="text_dash text-uppercase text-red fs-base fw-medium animate animate_fade animate_btt animate_delay-3">
                                    New Trend
                                </h6>
                                <h2 className="text-uppercase h1 fw-normal mb-0 animate animate_fade animate_btt animate_delay-5">
                                    Summer Sale Stylish
                                </h2>
                                <h2 className="text-uppercase h1 fw-bold animate animate_fade animate_btt animate_delay-5">
                                    Womens
                                </h2>
                                <a
                                    href="shop1.html"
                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                                >
                                    Discover More
                                </a>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 2 */}
                    <SwiperSlide className="swiper-slide full-width_border border-1" style={{ borderColor: "#f5e6e0" }}>
                        <div className="overflow-hidden position-relative h-100">
                            <div className="slideshow-bg" style={{ backgroundColor: "#f5e6e0" }}>
                                <img
                                    loading="lazy"
                                    src={slide2}
                                    width={1761}
                                    height={778}
                                    alt="Pattern"
                                    className="slideshow-bg__img object-fit-cover"
                                />
                            </div>

                            <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
                                <h6 className="text_dash text-uppercase text-red fs-base fw-medium animate animate_fade animate_btt animate_delay-3">
                                    năm 2024
                                </h6>
                                <h2 className="text-uppercase h1 fw-bold animate animate_fade animate_btt animate_delay-3">
                                    Hello New Season
                                </h2>
                                <h6 className="text-uppercase mb-5 animate animate_fade animate_btt animate_delay-3">
                                    Limited Time Offer - Up to 60% off & Free Shipping
                                </h6>
                                <a
                                    href="shop1.html"
                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-3"
                                >
                                    Discover More
                                </a>
                            </div>
                        </div>
                    </SwiperSlide>
                    {/* Slide 3 */}
                    <SwiperSlide className="swiper-slide full-width_border border-1" style={{ borderColor: "#f5e6e0" }}>
                        <div className="overflow-hidden position-relative h-100">
                            <div className="slideshow-bg" style={{ backgroundColor: "#f5e6e0" }}>
                                <img
                                    loading="lazy"
                                    src={slide3}
                                    width={1761}
                                    height={778}
                                    alt="Pattern"
                                    className="slideshow-bg__img object-fit-cover"
                                />
                            </div>

                            <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
                                <h6 className="text_dash text-uppercase text-red fs-base fw-medium animate animate_fade animate_btt animate_delay-3">
                                    Summer 2024
                                </h6>
                                <h2 className="text-uppercase h1 fw-bold animate animate_fade animate_btt animate_delay-3">
                                    Hello New Season
                                </h2>
                                <h6 className="text-uppercase mb-5 animate animate_fade animate_btt animate_delay-3">
                                    Limited Time Offer - Up to 60% off & Free Shipping
                                </h6>
                                <a
                                    href="shop1.html"
                                    className="btn-link btn-link_lg default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-3"
                                >
                                    Discover More
                                </a>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>



            </section>
            <div className="mb-3 pb-3 mb-md-4 pb-md-4 " />
            <div className="pb-1" />
            {/* Shop by collection */}
        </div>
    );
};

export default Slides;
