const express = require("express");
const {
  addItemToCart,
  decreaseProductQuantity,
  deleteItemFromCart,
  getCartByUserId,
  increaseProductQuantity,
  removeFromCart,
  updateProductQuantity,
  updateQuantityCart,
  deleteSelectedItemsFromCart
} = require("../controllers/cart");
const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post("/cart/add-to-cart", addItemToCart);

// Lấy giỏ hàng theo userId
router.get("/cart/:userId", getCartByUserId);

// Tăng số lượng sản phẩm trong giỏ hàng
router.patch("/cart/increase-quantity", increaseProductQuantity);

// Giảm số lượng sản phẩm trong giỏ hàng
router.patch("/cart/decrease-quantity", decreaseProductQuantity);

// Cập nhật số lượng của sản phẩm trong giỏ hàng từ input
router.patch("/cart/update-quantity", updateProductQuantity);

// Xóa item trong giỏ hàng
router.delete("/cart/:userId/product", deleteItemFromCart);

router.delete("/cart/:userId/delete-selected-items", deleteSelectedItemsFromCart);

module.exports = router;
