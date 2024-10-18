const { mongoose, Schema } = require("mongoose");

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: String, // Nếu bạn dùng ObjectId cho biến thể, đổi thành Schema.Types.ObjectId
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Đảm bảo số lượng tối thiểu là 1
        },
        priceAtTime: {
          type: Number,
          required: true, // Giá tại thời điểm thêm vào giỏ
        },
        totalPrice: {
          type: Number,
          required: true, // Tổng giá sản phẩm dựa trên số lượng
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

// Middleware để tự động tính tổng giá của từng sản phẩm
cartSchema.pre("save", function (next) {
  this.products.forEach((product) => {
    product.totalPrice = product.priceAtTime * product.quantity;
  });
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
