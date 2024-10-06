import { Router } from "express";
import {
  addItemToCart,
  decreaseProductQuantity,
  deleteItemFromCart,
  getCartByUserId,
  increaseProductQuantity,
  removeFromCart,
  updateProductQuantity,
  updateQuantityCart,
} from "../controllers/cart";
const router = Router();
router.post("/cart/add-to-cart", addItemToCart);
// router.put("/cart/update-product-quantity", updateQuantityCart);
router.get("/cart/:userId", getCartByUserId);
// Tăng số lượng của sản phẩm trong giỏ hàng
router.post("/carts/increase", increaseProductQuantity);
// Giảm số lượng của sản phẩm trong giỏ hàng
router.post("/carts/decrease", decreaseProductQuantity);
// Cập nhật số lượng của sản phẩm trong giỏ hàng từ input
router.post("/carts/update", updateProductQuantity);
// Xóa item trong giỏ hàng
router.post("/carts/remove", deleteItemFromCart);
export default router;
