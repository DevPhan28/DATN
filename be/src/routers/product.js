import express from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProductById,
  relatedProduct,
  updateProduct,
} from "../controllers/product";

const router = express.Router();
router.get(`/products`, getProduct);

router.get(`/products/:id`, getProductById);

router.get(`/products/:categoryId/related`, relatedProduct);
router.post(`/products`, addProduct);

router.put(`/products/:id`, updateProduct);

router.delete(`/products/:id`, deleteProduct);
export default router;
