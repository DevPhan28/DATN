const express = require("express");
// import {
//   addProduct,
//   deleteProduct,
//   getProduct,
//   getProductById,
//   relatedProduct,
//   updateProduct,
//   uploadThumbnail,
// } from "../controllers/product";
const { upload } = require("../config/multer");
const {
  getProduct,
  addProduct,
  uploadThumbnail,
  uploadGallery,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductAll,

} = require("../controllers/product");

const router = express.Router();
router.get(`/products`, getProduct);

router.get(`/products/:id`, getProductById);

// router.get(`/products/:categoryId/related`, relatedProduct);
router.post(`/products`, addProduct);
// router.get("/product", (req, res) => {
//   res.json({ message: "ok" });
// });
router.post(
  `/upload-thumbnail-product`,
  upload.single("image"),
  uploadThumbnail
);

router.post(
  `/upload-gallery-product`,
  upload.array("photos", 10),
  uploadGallery
);

router.put(`/products/:id`, updateProduct);

router.delete(`/products/:id`, deleteProduct);
router.get('/product', getProductAll)
module.exports = router;
