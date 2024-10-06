import express from "express";
import {
  deleteCategory,
  addCategory,
  getCategoryById,
  getCategorys,
  updateCategory,
} from "../controllers/category";

const router = express.Router();
router.get(`/categorys`, getCategorys);

router.get(`/categorys/:id`, getCategoryById);

router.post(`/.`, addCategory);

router.put(`/categorys/:id`, updateCategory);

router.delete(`/categorys/:id`, deleteCategory);
export default router;
