import CurrencyVND from '@/components/config/vnd';
import ErrorCart from '@/components/errors/error-cart';
import LoginCart from '@/components/errors/error-login-cart';
import { useCart } from '@/data/cart/useCartLogic';
import { ChevronRightMini, ReceiptPercent } from '@medusajs/icons';
import { toast } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/cart/')({
  component: Cart,
});

function Cart() {

  return (
    <div className='px-[40px]'>
      <main>
        <div className="mb-4 pb-4" />
        <section className="shop-checkout container">
          <h2 className="page-title">Cart</h2>
          <hr />
          <div className="shopping-cart">
            <div className="cart-table__wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th />
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="shopping-cart__product-item">
                        <a href="product1_simple.html">
                          <img loading="lazy" src="../images/cart-item-1.jpg" width={120} height={120} alt />
                        </a>
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4><a href="product1_simple.html">Zessi Dresses</a></h4>
                        <ul className="shopping-cart__product-item__options">
                          <li>Color: Yellow</li>
                          <li>Size: L</li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">$99</span>
                    </td>
                    <td>
                      <div className="qty-control position-relative">
                        <input type="number" name="quantity" defaultValue={3} min={1} className="qty-control__number text-center" />
                        <div className="qty-control__reduce">-</div>
                        <div className="qty-control__increase">+</div>
                      </div>{/* .qty-control */}
                    </td>
                    <td>
                      <span className="shopping-cart__subtotal">$297</span>
                    </td>
                    <td>
                      <a href="#" className="remove-cart">
                        <svg width={10} height={10} viewBox="0 0 10 10" fill="#767676" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.259435 8.85506L9.11449 0L10 0.885506L1.14494 9.74056L0.259435 8.85506Z" />
                          <path d="M0.885506 0.0889838L9.74057 8.94404L8.85506 9.82955L0 0.97449L0.885506 0.0889838Z" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="shopping-cart__product-item">
                        <a href="product1_simple.html">
                          <img loading="lazy" src="../images/cart-item-2.jpg" width={120} height={120} alt />
                        </a>
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4><a href="product1_simple.html">Kirby T-Shirt</a></h4>
                        <ul className="shopping-cart__product-item__options">
                          <li>Color: Yellow</li>
                          <li>Size: L</li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">$99</span>
                    </td>
                    <td>
                      <div className="qty-control position-relative">
                        <input type="number" name="quantity" defaultValue={3} min={1} className="qty-control__number text-center" />
                        <div className="qty-control__reduce">-</div>
                        <div className="qty-control__increase">+</div>
                      </div>{/* .qty-control */}
                    </td>
                    <td>
                      <span className="shopping-cart__subtotal">$297</span>
                    </td>
                    <td>
                      <a href="#" className="remove-cart">
                        <svg width={10} height={10} viewBox="0 0 10 10" fill="#767676" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.259435 8.85506L9.11449 0L10 0.885506L1.14494 9.74056L0.259435 8.85506Z" />
                          <path d="M0.885506 0.0889838L9.74057 8.94404L8.85506 9.82955L0 0.97449L0.885506 0.0889838Z" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="shopping-cart__product-item">
                        <a href="product1_simple.html">
                          <img loading="lazy" src="../images/cart-item-3.jpg" width={120} height={120} alt />
                        </a>
                      </div>
                    </td>
                    <td>
                      <div className="shopping-cart__product-item__detail">
                        <h4><a href="product1_simple.html">Cobleknit Shawl</a></h4>
                        <ul className="shopping-cart__product-item__options">
                          <li>Color: Yellow</li>
                          <li>Size: L</li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <span className="shopping-cart__product-price">$99</span>
                    </td>
                    <td>
                      <div className="qty-control position-relative">
                        <input type="number" name="quantity" defaultValue={3} min={1} className="qty-control__number text-center" />
                        <div className="qty-control__reduce">-</div>
                        <div className="qty-control__increase">+</div>
                      </div>{/* .qty-control */}
                    </td>
                    <td>
                      <span className="shopping-cart__subtotal">$297</span>
                    </td>
                    <td>
                      <a href="#" className="remove-cart">
                        <svg width={10} height={10} viewBox="0 0 10 10" fill="#767676" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.259435 8.85506L9.11449 0L10 0.885506L1.14494 9.74056L0.259435 8.85506Z" />
                          <path d="M0.885506 0.0889838L9.74057 8.94404L8.85506 9.82955L0 0.97449L0.885506 0.0889838Z" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="cart-table-footer">
                <form action="https://uomo-html.flexkitux.com/Demo1/" className="position-relative bg-body">
                  <input className="form-control" type="text" name="coupon_code" placeholder="Coupon Code" />
                  <input className="btn-link fw-medium position-absolute top-0 end-0 h-100 px-4" type="submit" defaultValue="APPLY COUPON" />
                </form>
                <button className="btn btn-light">UPDATE CART</button>
              </div>
            </div>
            <div className="shopping-cart__totals-wrapper">
              <div className="sticky-content">
                <div className="shopping-cart__totals">
                  <h3>Cart Totals</h3>
                  <table className="cart-totals">
                    <tbody>
                      <tr>
                        <th>Subtotal</th>
                        <td>$1300</td>
                      </tr>
                      <tr>
                        <th>Shipping</th>
                        <td>
                          <div className="form-check">
                            <input className="form-check-input form-check-input_fill" type="checkbox" defaultValue id="free_shipping" />
                            <label className="form-check-label" htmlFor="free_shipping">Free shipping</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input form-check-input_fill" type="checkbox" defaultValue id="flat_rate" />
                            <label className="form-check-label" htmlFor="flat_rate">Flat rate: $49</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input form-check-input_fill" type="checkbox" defaultValue id="local_pickup" />
                            <label className="form-check-label" htmlFor="local_pickup">Local pickup: $8</label>
                          </div>
                          <div>Shipping to AL.</div>
                          <div>
                            <a href="#" className="menu-link menu-link_us-s">CHANGE ADDRESS</a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>VAT</th>
                        <td>$19</td>
                      </tr>
                      <tr>
                        <th>Total</th>
                        <td>$1319</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mobile_fixed-btn_wrapper">
                  <div className="button-wrapper container">
                    <button className="btn btn-primary btn-checkout">PROCEED TO CHECKOUT</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="mb-5 pb-xl-5" />
    </div>

  );
}

export default Cart;
