import React from 'react'
import deal_timer from '../assets/images/deal_timer_bg.jpg';
import hot_list1 from '../assets/images/banner_1.jpg';
import hot_list2 from '../assets/images/banner_2.jpg';
const Collection = () => {
    return (
        <div>
            <section className="deal-timer position-relative d-flex align-items-end overflow-hidden" style={{ backgroundColor: '#ebebeb' }}>
                <div className="background-img" style={{ backgroundImage: `url(${deal_timer})` }} />
                <div className="deal-timer-wrapper container position-relative">
                    <div className="deal-timer__content pb-2 mb-3 pb-xl-5 mb-xl-3 mb-xxl-5">
                        <p className="text_dash text-uppercase text-red fw-medium">Deal of the week</p>
                        <h3 className="h1 text-uppercase"><strong>Spring</strong> Collection</h3>
                        <a href="shop1.html" className="btn-link default-underline text-uppercase fw-medium mt-3">Shop Now</a>
                    </div>
                    <div className="position-relative d-flex align-items-center text-center pt-xxl-4 js-countdown" data-date="18-5-2024" data-time="06:50">
                        <div className="day countdown-unit">
                            <span className="countdown-num d-block" />
                            <span className="countdown-word fw-bold text-uppercase text-secondary">Days</span>
                        </div>
                        <div className="hour countdown-unit">
                            <span className="countdown-num d-block" />
                            <span className="countdown-word fw-bold text-uppercase text-secondary">Hours</span>
                        </div>
                        <div className="min countdown-unit">
                            <span className="countdown-num d-block" />
                            <span className="countdown-word fw-bold text-uppercase text-secondary">Mins</span>
                        </div>
                        <div className="sec countdown-unit">
                            <span className="countdown-num d-block" />
                            <span className="countdown-word fw-bold text-uppercase text-secondary">Sec</span>
                        </div>
                    </div>
                </div>{/* /.deal-timer-wrapper */}
            </section>{/* /.deal-timer */}
            <div className="mb-3  pb-1 " />
            <section className="grid-banner container p-[55px]">
                <div className=''>
                    <div >
                        <div className="row ">
                            <div className="col-md-6">
                                <div className="grid-banner__item grid-banner__item_rect position-relative mb-3">
                                    <div className="background-img" style={{ backgroundImage: `url(${hot_list1})` }} />
                                    <div className="content_abs content_bottom content_left content_bottom-lg content_left-lg">
                                        <h6 className="text-uppercase text-white fw-medium mb-3">Starting At $19</h6>
                                        <h3 className="text-white mb-3">Women's T-Shirts</h3>
                                        <a href="shop1.html" className="btn-link default-underline text-uppercase text-white fw-medium">Shop Now</a>
                                    </div>{/* /.content_abs content_bottom content_left content_bottom-md content_left-md */}
                                </div>
                            </div>{/* /.col-md-6 */}
                            <div className="col-md-6">
                                <div className="grid-banner__item grid-banner__item_rect position-relative mb-3">
                                    <div className="background-img" style={{ backgroundImage: `url(${hot_list2})` }} />
                                    <div className="content_abs content_bottom content_left content_bottom-lg content_left-lg">
                                        <h6 className="text-uppercase fw-medium mb-3">Starting At $39</h6>
                                        <h3 className="mb-3">Men's Sportswear</h3>
                                        <a href="shop1.html" className="btn-link default-underline text-uppercase fw-medium">Shop Now</a>
                                    </div>{/* /.content_abs content_bottom content_left content_bottom-md content_left-md */}
                                </div>
                            </div>{/* /.col-md-6 */}
                        </div>{/* /.row */}
                    </div>
                </div>


            </section>{/* /.grid-banner container */}
            <div className="mb-5 pb-1 pb-xl-4" />
        </div>
    )
}

export default Collection