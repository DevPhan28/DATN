// models/coupon.js
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
  },
  minOrder: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
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
