import { Link } from "@tanstack/react-router";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import slide1 from '../assets/images/banner-01.png';
import slide2 from '../assets/images/banner-02.png';
const Slides = () => {
    return (
        <div className=" slider-block style-one bg-linear xl:h-[500px] lg:h-[400px] md:h-[400px] sm:h-[250px] h-[250px] max-[420px]:h-[300px] w-full">
            <div className="slider-main h-full w-full">
                <div className="swiper swiper-slider h-full relative">
                    {/* <div className="swiper-wrapper"> */}
                    <Swiper
                        className={"swiper-wrapper"}
                        modules={[Pagination, Autoplay]}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                    >
                        <SwiperSlide className="swiper-slide">
                            {/* <div className="swiper-slide"> */}
                            <div className="slider-item h-full w-full relative">
                                <div className="container w-full h-full flex items-center relative">
                                    <div className="text basis-1/2 md:text-left flex flex-col items-start justify-end px-44">
                                        <div className="text-3xl font-semibold text-center md:text-left">Fashion <span className="text-gray-400">zone!</span></div>
                                        <div className="text-display text-gray-700 text-left   lg:text-[60px] font-semibold">
                                            Sáng tạo, nổi bật chính mình
                                        </div>
                                        <Link to={"/shop"} className="button-main md:mt-2 rounded-lg bg-blue-500 hover:bg-black text-white lg:p-4 lg:px-12 md:p-2 md:px-8 p-2 px-12 font-semibold uppercase">
                                            Mua Ngay
                                        </Link>
                                    </div>
                                    <div className="sub-img absolute sm:w-1/2 w-3/5 2xl:-right-[-100px] -right-[16px] bottom-0">
                                        <img
                                            src={slide1}
                                            alt="bg1-1"
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* </div> */}
                        </SwiperSlide>

                        <SwiperSlide className="swiper-slide">
                            {/* <div className="swiper-slide"> */}
                            <div className="slider-item h-full w-full relative">
                                <div className="container w-full h-full flex items-center relative">
                                    <div className="text basis-1/2 md:text-left flex flex-col items-start justify-end px-44">
                                        <div className="text-3xl font-semibold text-center md:text-left">Fashion <span className="text-gray-400">zone!</span></div>
                                        <div className="text-display text-gray-700 text-left   lg:text-[60px] font-semibold">
                                            Phong cách riêng của bạn
                                        </div>
                                        <Link to={"/shop"} className="button-main md:mt-2 rounded-lg bg-blue-500 hover:bg-black text-white lg:p-4 lg:px-12 md:p-2 md:px-8 p-2 px-12 font-semibold uppercase">
                                            Mua Ngay
                                        </Link>
                                    </div>
                                    <div className="sub-img absolute sm:w-1/2 w-3/5 2xl:-right-[-100px] -right-[16px] bottom-0">
                                        <img
                                            src={slide2}
                                            alt="bg1-1"
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* </div> */}
                        </SwiperSlide>
                    </Swiper>
                    {/* </div> */}
                    <div className="swiper-pagination" />
                </div>
            </div>
        </div>
    );
};

export default Slides;
