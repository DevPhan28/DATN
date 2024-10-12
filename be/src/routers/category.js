const express = require("express");
const {
  deleteCategory,
  addCategory,
  getCategoryById,
  getCategorys,
  updateCategory,
} = require("../controllers/category");

const router = express.Router();
router.get(`/categories`, getCategorys);

router.get(`/categorys/:id`, getCategoryById);

router.post(`/categories`, addCategory);

router.put(`/categorys/:id`, updateCategory);

router.delete(`/categorys/:id`, deleteCategory);
module.exports = router;
