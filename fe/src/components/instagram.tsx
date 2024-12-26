import React from 'react'
import inta1 from '../assets/instagram/insta1.jpg';
import inta2 from '../assets/instagram/insta2.jpg';
import inta3 from '../assets/instagram/insta3.jpg';
import inta4 from '../assets/instagram/insta4.jpg';
import inta5 from '../assets/instagram/insta5.jpg';
import inta6 from '../assets/instagram/insta6.jpg';
import inta7 from '../assets/instagram/insta7.jpg';
import inta8 from '../assets/instagram/insta8.jpg';
import inta9 from '../assets/instagram/insta9.jpg';
import inta10 from '../assets/instagram/insta10.jpg';
import inta11 from '../assets/instagram/insta11.jpg';
import inta12 from '../assets/instagram/insta12.jpg';
const Instagram = () => {
    return (
        <div>
            <section className="instagram container">
                <h2 className="section-title text-uppercase text-center mb-4 pb-xl-2 mb-xl-4">@UOMO</h2>
                <div className="row row-cols-3 row-cols-md-4 row-cols-xl-6 px-[40px]">
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta1} width={230} height={230} alt="Insta image 1" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta2} width={230} height={230} alt="Insta image 2" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta3} width={230} height={230} alt="Insta image 3" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta4} width={230} height={230} alt="Insta image 4" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta5} width={230} height={230} alt="Insta image 5" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta6} width={230} height={230} alt="Insta image 6" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta7} width={230} height={230} alt="Insta image 7" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta8} width={230} height={230} alt="Insta image 8" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta9} width={230} height={230} alt="Insta image 9" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta10} width={230} height={230} alt="Insta image 10" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta11} width={230} height={230} alt="Insta image 11" />
                        </a>
                    </div>
                    <div className="instagram__tile">
                        <a href="https://instagram.com/" target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus">
                            <img loading="lazy" className="instagram__img" src={inta12} width={230} height={230} alt="Insta image 12" />
                        </a>
                    </div>
                </div>
            </section>{/* /.instagram container */}
            <div className="mb-4 pb-4 pb-xl-5 mb-xl-5" />
            <section className="service-promotion container mb-md-4 pb-md-4 mb-xl-5">
                <div className="row">
                    <div className="col-md-4 text-center mb-5 mb-md-0">
                        <div className="service-promotion__icon mb-4">
                            <svg width={52} height={52} viewBox="0 0 52 52" fill="none" xmlns="https://picsum.photos/200/300">
                                <use href="#icon_shipping" />
                            </svg>
                        </div>
                        <h3 className="service-promotion__title h5 text-uppercase">Fast And Free Delivery</h3>
                        <p className="service-promotion__content text-secondary">Free delivery for all orders over $140</p>
                    </div>{/* /.col-md-4 text-center*/}
                    <div className="col-md-4 text-center mb-5 mb-md-0">
                        <div className="service-promotion__icon mb-4">
                            <svg width={53} height={52} viewBox="0 0 53 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <use href="#icon_headphone" />
                            </svg>
                        </div>
                        <h3 className="service-promotion__title h5 text-uppercase">24/7 Customer Support</h3>
                        <p className="service-promotion__content text-secondary">Friendly 24/7 customer support</p>
                    </div>{/* /.col-md-4 text-center*/}
                    <div className="col-md-4 text-center mb-4 pb-1 mb-md-0">
                        <div className="service-promotion__icon mb-4">
                            <svg width={52} height={52} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <use href="#icon_shield" />
                            </svg>
                        </div>
                        <h3 className="service-promotion__title h5 text-uppercase">Money Back Guarantee</h3>
                        <p className="service-promotion__content text-secondary">We return money within 30 days</p>
                    </div>{/* /.col-md-4 text-center*/}
                </div>{/* /.row */}
            </section>{/* /.service-promotion container */}
        </div>
    )
}

export default Instagram