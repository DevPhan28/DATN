const CreateSlugByTitle = require("../config/slug"); // Không sử dụng destructuring

const Product = require("../models/product");
const getProduct = async (req, res) => {
  // Lấy limit và page từ query, với giá trị mặc định là 10 và 1
  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit; // Tính toán số sản phẩm cần bỏ qua

  try {
    const products = await Product.find({})
      .limit(Number(limit))
      .skip(Number(skip))
      .populate("category", "name"); // Sử dụng populate để lấy tên danh mục

    const totalItems = await Product.countDocuments(); // Đếm tổng số sản phẩm

    if (products.length === 0) {
      return res.status(200).json({
        meta: {
          totalItems: 0,
          totalPages: 0, // Tính toán tổng số trang
          currentPage: Number(page), // Trang hiện tại
          limit: Number(limit), // Số sản phẩm trên mỗi trang
        },
        data: [],
      });
    }

    return res.status(200).json({
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit), // Tính toán tổng số trang
        currentPage: Number(page), // Trang hiện tại
        limit: Number(limit), // Số sản phẩm trên mỗi trang
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const data = await Product.findById(req.params.id);
    if (data.length < 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    return res.status(201).json({
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProductBySlug = async (req, res) => {
  try {
    const productSlug = req.params.slug; // Lấy slug từ tham số đường dẫn

    // Tìm sản phẩm theo slug
    const product = await Product.findOne({ slug: productSlug });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    // Lấy file ảnh từ req (req.image) và nhiều ảnh gallery
    // Giả sử req.body có một trường variants chứa danh sách các biến thể
    const { variants, ...productData } = req.body;

    // Kiểm tra xem có variants không và tính tổng countInStock
    const totalCountInStock =
      variants?.reduce((total, variant) => {
        return total + Number(variant.countInStock);
      }, 0) || 0; // Nếu không có variants, totalCountInStock sẽ là 0

    // Tạo slug từ name
    const slug = CreateSlugByTitle(productData.name); // Đảm bảo sử dụng productData.name

    // Tạo sản phẩm mới với totalCountInStock
    const product = new Product({
      ...productData,
      slug, // Gán slug vào sản phẩm
      countInStock: totalCountInStock,
      variants, // Nếu bạn cũng muốn lưu biến thể
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    const data = await product.save();

    return res.status(201).json({
      message: "Tạo sản phẩm thành công",
      data,
    });
  } catch (error) {
    // Trả về thông báo lỗi cụ thể hơn nếu có thể
    return res
      .status(500)
      .json({ message: error.message || "Có lỗi xảy ra khi tạo sản phẩm." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id);
    if (data.length < 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào" });
    }
    return res.status(201).json({ messages: "Xóa sản phẩm thành công", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (data.length < 0) {
      return res.status(404).json({ message: "No product found" });
    }
    return res.status(201).json({
      messages: "Cập nhật sản phẩm thành công",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const relatedProduct = async (req, res) => {
  try {
    const product = await Product.find({ categories: req.params.categoryId });
    return res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadThumbnail = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json(file.path);
};

const uploadGallery = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = [];

    for (const file of files) {
      uploadedFiles.push(file.path);
    }

    res.json(uploadedFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" + error });
  }
};
const getProductAll = async (req, res) => {
  try {
    // Lấy toàn bộ danh sách sản phẩm, sử dụng populate để lấy tên danh mục
    const products = await Product.find({}).populate("category", "name");

    // Đếm tổng số sản phẩm
    const totalItems = await Product.countDocuments();

    if (products.length === 0) {
      return res.status(200).json({
        meta: {
          totalItems: 0,
        },
        data: [],
      });
    }

    return res.status(200).json({
      meta: {
        totalItems, // Tổng số sản phẩm
      },
      data: products, // Trả về tất cả sản phẩm
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProduct,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  relatedProduct,
  uploadThumbnail,
  uploadGallery,
  getProductAll,
  getProductBySlug,
};
