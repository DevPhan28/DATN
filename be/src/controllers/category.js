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
    // Tìm danh mục theo ID
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // Tìm các sản phẩm thuộc danh mục
    const products = await Product.find({ category: req.params.id });

    // Trả về dữ liệu danh mục và sản phẩm
    return res.status(200).json({
      category, // Đổi tên từ categories -> category (số ít)
      products,
    });
  } catch (error) {
    // Xử lý lỗi server
    res.status(500).json({ message: error.message });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    // Tìm danh mục theo slug
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // Tìm các sản phẩm thuộc danh mục
    const products = await Product.find({ category: category._id });

    // Trả về dữ liệu danh mục và sản phẩm
    return res.status(200).json({
      category, // Thông tin danh mục
      products, // Danh sách sản phẩm thuộc danh mục
    });
  } catch (error) {
    // Xử lý lỗi server
    res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    // Tạo slug từ tên danh mục
    const rootCategory = await Category.findOne({ name: "Danh mục gốc" });

    if (!rootCategory) {
      // Tạo danh mục gốc nếu chưa có
      const newRootCategory = new Category({
        name: "Danh mục gốc",
        slug: "danh-muc-goc",
        parentCategory: null, // Đặt parentCategory là null
      });

      await newRootCategory.save();
    } 
    const slug = slugify(req.body.name, { lower: true, strict: true });

    // Tạo danh mục
    const category = await Category.create({
      name: req.body.name,
      slug, // Thêm slug vào dữ liệu
    });

    return res.status(201).json({
      message: "Tạo danh mục thành công",
      category, // Đổi tên từ categories -> category cho đúng số ít
    });
  } catch (error) {
    // Kiểm tra lỗi trùng slug (hoặc tên)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Danh mục đã tồn tại",
      });
    }

    // Xử lý lỗi khác
    res.status(500).json({ message: error.message });
  }
};

const getRootCategory = async (req, res) => {
  try {
    const rootCategory = await Category.findOne({ parentCategory: null });
    if (!rootCategory) {
      return res.status(404).json({ message: "Danh mục gốc không tồn tại" });
    }
    return res.status(200).json(rootCategory);
  } catch (error) {
    console.error("Lỗi khi lấy danh mục gốc:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy danh mục gốc" });
  }
};
const findRootCategory = async () => {
  let rootCategory = await Category.findOne({ parentCategory: null });
  if (!rootCategory) {
    rootCategory = new Category({
      name: "Danh mục gốc",
      slug: "danh-muc-goc",
      parentCategory: null,
    });
    await rootCategory.save();
  }
  return rootCategory;
};

const deleteCategory = async (req, res) => {
  try {
    // Lấy danh mục cần xóa
    const categoryToDelete = await Category.findById(req.params.id);
    if (!categoryToDelete) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    // Tìm danh mục gốc
    const rootCategory = await Category.findOne({ parentCategory: null });

    // Kiểm tra nếu danh mục cần xóa là danh mục gốc
    if (categoryToDelete._id.toString() === rootCategory._id.toString()) {
      return res.status(400).json({ message: "Không thể xóa danh mục gốc" });
    }

    // Xử lý sản phẩm thuộc danh mục cần xóa
    await Product.updateMany(
      { category: categoryToDelete._id },
      { $set: { category: rootCategory._id } }
    );

    // Xóa danh mục
    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Danh mục đã được xóa thành công, sản phẩm đã được chuyển sang danh mục gốc",
    });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error.message);
    res.status(500).json({ message: "Có lỗi xảy ra trong quá trình xóa danh mục" });
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
  getCategoryBySlug,
  getRootCategory,
};
