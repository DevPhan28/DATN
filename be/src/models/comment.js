// models/comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết đến người dùng
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Liên kết đến sản phẩm
      required: true,
    },
    commentText: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Giá trị đánh giá từ 1 đến 5 sao
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Comment", commentSchema);
