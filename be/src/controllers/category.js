const Category = require("../models/category");
const Product = require("../models/product");
const slugify = require("slugify");

const getCategorys = async (req, res) => {
  try {
    const categories = await Category.find({});
    if (categories.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id });
    const categories = await Category.findById(req.params.id);
    if (categories.length < 0) {
      return res.status(404).json({ message: "Không có danh mục nào" });
    }
    return res.status(201).json({
      categories,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const categories = await Category.create({
      name: req.body.name,
     
    });
    return res.status(201).json({
      messages: "Tạo danh mục thành công",
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categories = await Category.findByIdAndDelete(req.params.id);
    if (categories.length < 0) {
      return res.status(404).json({ message: "Không có danh mục nào" });
    }
    return res
      .status(201)
      .json({ messages: "Xóa danh mục thành công", categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categories = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (categories.length < 0) {
      return res.status(404).json({ message: "Không có danh mục nào" });
    }
    return res.status(201).json({
      messages: "Cập nhật danh mục thành công",
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategorys,
  getCategoryById,
  addCategory,
  deleteCategory,
  updateCategory,
};
