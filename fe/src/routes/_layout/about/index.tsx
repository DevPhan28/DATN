import { createFileRoute } from '@tanstack/react-router';
import aboutBanner from '../../../assets/images/about/about-1.jpg';
import aboutBanner2 from '../../../assets/images/about/about-2.jpg';
import brand1 from '../../../assets/images/brands/brand1.png';
import brand2 from '../../../assets/images/brands/brand2.png';
import brand3 from '../../../assets/images/brands/brand3.png';
import brand4 from '../../../assets/images/brands/brand4.png';
import brand5 from '../../../assets/images/brands/brand5.png';
import brand6 from '../../../assets/images/brands/brand6.png';
import brand7 from '../../../assets/images/brands/brand7.png';
export const Route = createFileRoute('/_layout/about/')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className='px-[40px]'>
      <div>
        <main>
          <div className="mb-4 pb-4" />
          <section className="about-us container">
            <div className="mw-930">
              <h2 className="page-title">Về Chúng tôi </h2>
            </div>
            <div className="about-us__content pb-5 mb-5">
              <p className="mb-5">
                <img loading="lazy" className="w-100 h-auto d-block" src={aboutBanner} width={1410} height={550} alt />
              </p>
              <div className="mw-930">
                <h3 className="mb-4">CÂU CHUYỆN CỦA CHÚNG TÔI</h3>
                <p className="fs-6 fw-medium mb-4">Fashion Zone tự hào là thương hiệu hàng đầu mang đến những bộ sưu tập thời trang hiện đại, trẻ trung và đầy phong cách. Với sứ mệnh giúp khách hàng tỏa sáng và thể hiện cá tính riêng, chúng tôi luôn cập nhật xu hướng mới nhất từ các kinh đô thời trang trên thế giới.</p>
                <p className="mb-4">Đa dạng sản phẩm: Từ quần áo, váy, phụ kiện cho đến giày dép, tất cả đều được thiết kế tinh tế và phù hợp với nhiều phong cách.</p>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h5 className="mb-3">Sứ mệnh của chúng tôi</h5>
                    <p className="mb-3">Ai không thực hành bất kỳ loại công việc nào ngoại trừ để có được một số lợi ích từ nó.</p>
                  </div>
                  <div className="col-md-6">
                    <h5 className="mb-3">Sứ mệnh của chúng tôi</h5>
                    <p className="mb-3">Ai không thực hành bất kỳ loại công việc nào ngoại trừ để có được một số lợi ích từ nó.</p>
                  </div>
                </div>
              </div>
              <div className="mw-930 d-lg-flex align-items-lg-center">
                <div className="image-wrapper col-lg-6">
                  <img className="h-auto" loading="lazy" src={aboutBanner2} width={450} height={500} alt />
                </div>
                <div className="content-wrapper col-lg-6 px-lg-4">
                  <h5 className="mb-3">Công ty</h5>
                  <p>Khách hàng rất quan trọng, khách hàng sẽ được khách hàng theo đuổi. Amet sapien dignissim a elementum. Sự sợ hãi của các đối tác, Hendrerit mauris nó. Quis sit sit ultrices tincidunt Euismod luctus diam. Các thành viên nghèo của bệnh viện cũng là một giai đoạn của hồ. Bây giờ buồn cười quá, đôi khi không có phim hoạt hình đại chúng. Đó là tác giả không có bệnh tật mà không có nền tảng. Ngày mai tôi sẽ ném một quả bóng vào đó.</p>
                </div>
              </div>
            </div>
          </section>
          <section className="service-promotion horizontal container mw-930 pt-0 mb-md-4 pb-md-4 mb-xl-5">
            <div className="row">
              <div className="col-md-4 text-center mb-5 mb-md-0">
                <div className="service-promotion__icon mb-4">
                  <i className="fa-solid fa-gift text-[40px]"></i>
                </div>
                <h3 className="service-promotion__title fs-6 text-uppercase">Giao hàng nhanh và miễn phí</h3>
                <p className="service-promotion__content text-secondary">Giao hàng miễn phí cho tất cả các đơn hàng trên 500.000đ</p>
              </div>{/* /.col-md-4 text-center*/}
              <div className="col-md-4 text-center mb-5 mb-md-0">
                <div className="service-promotion__icon mb-4">
                  <i className="fa-solid fa-headset text-[40px]"></i>
                </div>
                <h3 className="service-promotion__title fs-6 text-uppercase">Hỗ trợ khách hàng 24/7</h3>
                <p className="service-promotion__content text-secondary">Hỗ trợ khách hàng thân thiện 24/7</p>
              </div>{/* /.col-md-4 text-center*/}
              <div className="col-md-4 text-center mb-4 pb-1 mb-md-0">
                <div className="service-promotion__icon mb-4">
                  <i className="fa-solid fa-shield text-[40px]"></i>
                </div>
                <h3 className="service-promotion__title fs-6 text-uppercase">Đảm bảo hoàn tiền</h3>
                <p className="service-promotion__content text-secondary">Chúng tôi trả lại tiền trong vòng 15 ngày</p>
              </div>{/* /.col-md-4 text-center*/}
            </div>{/* /.row */}
          </section>
          <section className="brands-carousel container mw-930">
            <h5 className="mb-3 mb-xl-5">Đối tác công ty</h5>
            <div className="flex gap-5">
              <div>
                <img src={brand1} alt="" />
              </div>
              <div>
                <img src={brand2} alt="" />
              </div>
              <div>
                <img src={brand3} alt="" />
              </div>
              <div>
                <img src={brand4} alt="" />
              </div>
              <div>
                <img src={brand5} alt="" />
              </div>
              <div>
                <img src={brand6} alt="" />
              </div>
              <div>
                <img src={brand7} alt="" />
              </div>
            </div>

          </section>
        </main>
        <div className="mb-5 pb-xl-5" />
      </div>

    </div>
  );
}
