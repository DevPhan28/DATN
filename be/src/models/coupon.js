const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: function () {
      return !this.isFreeShipping;
    },
    validate: {
      validator: function (v) {
        return v <= 100; 
      },
      message: "Discount cannot be more than 100%",
    },
  },
  minOrder: {
    type: Number,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date, // Ngày bắt đầu của mã giảm giá
    required: false,
  },
  maxDiscountAmount: {
    type: Number, // Số tiền tối đa được giảm
    default: 0, // Mặc định là không có giới hạn tối đa
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFreeShipping: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
