import Product from "../models/product";

export const getProduct = async (req, res) => {
    // Lấy limit và page từ query, với giá trị mặc định là 10 và 1
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit; // Tính toán số sản phẩm cần bỏ qua

    try {
        const products = await Product.find({})
            .limit(Number(limit))
            .skip(Number(skip))
            .populate('category', 'name'); // Sử dụng populate để lấy tên danh mục

        const totalItems = await Product.countDocuments(); // Đếm tổng số sản phẩm

        if (products.length === 0) {
            return res.status(404).json({ message: "Không có sản phẩm nào" });
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

  
export const getProductById = async (req, res) => {
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

export const addProduct = async (req, res) => {
    // lấy file ảnh từ req ( req image) 1 anh
    // lấy nhiều ảnh gallery 
    // use cloudary push links lên nhận vè url ảnh trên cloud
  try {
    // Giả sử req.body có một trường variants chứa danh sách các biến thể
    const { variants, ...productData } = req.body;
    // Tính tổng countInStock từ các biến thể
    const totalCountInStock = variants.reduce((total, variant) => {
      return total + variant.countInStock;
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

export const deleteProduct = async (req, res) => {
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

export const updateProduct = async (req, res) => {
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

export const relatedProduct = async (req, res) => {
  try {
    const product = await Product.find({ categories: req.params.categoryId });
    return res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
