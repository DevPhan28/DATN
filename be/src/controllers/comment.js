const { default: mongoose } = require("mongoose");
const Comment = require("../models/comment");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

const addComment = async (req, res) => {
  const { productId, content, rating, userId } = req.body;
  if (!productId || !content || !userId) {
    return res.status(400).json({ message: "Thiếu các trường bắt buộc" });
  }
  const existingComment = await Comment.findOne({ userId, productId });
  if (existingComment) {
    return res.status(400).json({ message: 'Bạn đã bình luận sản phẩm này rồi' });
  }

  try {
    const product = await Product.findById(productId);
    const user = await User.findById(userId);

    if (!product || !user) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm hoặc người dùng" });
    }

    const order = await Order.findOne({
      userId,
      "items.productId": productId, 
      status: { $in: ["delivered", "received"] }, 
    });

    if (!order) {
      return res.status(400).json({ message: "Bạn cần mua sản phẩm trước khi bình luận" });
    }
    const newComment = new Comment({
      productId,
      userId,
      commentText: content,
      rating,
    });

    await newComment.save();

    res.status(201).json({
      message: "Bình luận đã được thêm thành công!",
      productId: productId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể thêm bình luận" });
  }
};
 
const getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await Comment.find({ productId })
      .populate({
        path: "userId",
        select: "username email",
      });

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        message: "Không có bình luận nào cho sản phẩm này",
      });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách bình luận",
      error: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId, role } = req.user;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: "ID bình luận không hợp lệ" });
  }

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }
 
    if (comment.userId.toString() !== userId && role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này" });
    }

    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
 
const deleteCommentByAdmin = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

module.exports = {
  addComment,
  getCommentsByProduct,
  deleteComment,
  deleteCommentByAdmin,
};
