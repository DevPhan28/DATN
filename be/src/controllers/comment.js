const { default: mongoose } = require("mongoose");
const Comment = require("../models/comment");
const Product = require("../models/product");
const User = require("../models/user");

// Thêm bình luận
const addComment = async (req, res) => {
  const { productId, content, rating, userId } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!productId || !content || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Kiểm tra sản phẩm và người dùng có tồn tại không
    const product = await Product.findById(productId);
    const user = await User.findById(userId);

    if (!product || !user) {
      return res.status(404).json({ message: 'Product or user not found' });
    }

    // Tạo bình luận mới
    const newComment = new Comment({
      productId,
      userId,
      commentText: content,
      rating,
    });

    await newComment.save();

    // Trả về productId trong phản hồi để frontend có thể sử dụng
    res.status(201).json({
      message: 'Bình luận đã được thêm thành công!',
      productId: productId,  // Thêm productId vào phản hồi
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Không thể thêm bình luận' });
  }
};


// Lấy tất cả bình luận của một sản phẩm
const getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await Comment.find({ productId })
      .populate("userId", "username avatar") // Lấy thông tin người dùng
      .exec();

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Xóa bình luận
const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId, role } = req.user; // Lấy userId và role từ req.user

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: 'Invalid comment ID' });
  }

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Kiểm tra nếu người dùng là chủ bình luận hoặc admin mới có thể xóa
    if (comment.userId.toString() !== userId && role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    // Xóa bình luận
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error('Error while deleting comment:', error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = {
  addComment,
  getCommentsByProduct,
  deleteComment,
};
