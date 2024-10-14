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

const addProduct = async (req, res) => {
  // lấy file ảnh từ req ( req image) 1 anh
  // lấy nhiều ảnh gallery
  // use cloudary push links lên nhận vè url ảnh trên cloud
  try {
    // Giả sử req.body có một trường variants chứa danh sách các biến thể
    const { variants, ...productData } = req.body;
    // Tính tổng countInStock từ các biến thể
    const totalCountInStock = variants.reduce((total, variant) => {
      return total + Number(variant.countInStock);
    }, 0);
    // Tạo sản phẩm mới với totalCountInStock
    const product = new Product({
      ...productData,
      countInStock: totalCountInStock,
      variants, // Nếu bạn cũng muốn lưu biến thể
    });
    const data = await product.save();
    return res.status(201).json({
      message: "Tạo sản phẩm thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// const addProduct = async (req, res) => {
//   try {
//     // Destructure variants and other product data from the request body
//     const { variants, ...productData } = req.body;

//     // Validate that variants exist and are in an array format
//     if (!variants || !Array.isArray(variants)) {
//       return res.status(400).json({ message: "Variants must be provided as an array." });
//     }

//     // Validate each variant and ensure countInStock is a number
//     for (let i = 0; i < variants.length; i++) {
//       const variant = variants[i];

//       // Check for the presence of countInStock
//       if (variant.countInStock === undefined || variant.countInStock === null) {
//         return res.status(400).json({ message: `countInStock is missing in variant at index ${i}.` });
//       }

//       // Ensure countInStock is a number
//       if (typeof variant.countInStock !== 'number') {
//         // Attempt to parse it if it's a string
//         const parsedCount = Number(variant.countInStock);
//         if (isNaN(parsedCount)) {
//           return res.status(400).json({ message: `countInStock must be a number in variant at index ${i}.` });
//         }
//         variants[i].countInStock = parsedCount;
//       }

//       // Optional: Validate other fields in variant as needed
//       // Example:
//       // if (!variant.size || !variant.color) {
//       //   return res.status(400).json({ message: `Size and color are required in variant at index ${i}.` });
//       // }
//     }

//     // Calculate total countInStock from variants
//     const totalCountInStock = variants.reduce((total, variant) => total + variant.countInStock, 0);

//     // Optional: Handle image uploads here if necessary
//     // Example: Upload image to Cloudinary and get the URL
//     // const imageUploadResult = await uploadImageToCloudinary(req.file);
//     // productData.image = imageUploadResult.url;

//     // Create a new product instance with the aggregated countInStock
//     const product = new Product({
//       ...productData,
//       countInStock: totalCountInStock,
//       variants, // Save variants if you intend to keep them in the product document
//     });

//     // Save the product to the database
//     const savedProduct = await product.save();

//     // Respond with success and the saved product data
//     return res.status(201).json({
//       message: "Tạo sản phẩm thành công",
//       data: savedProduct,
//     });
//   } catch (error) {
//     console.error("Error in addProduct:", error);
//     return res.status(500).json({ message: "Đã xảy ra lỗi khi tạo sản phẩm.", error: error.message });
//   }
// };

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
};
