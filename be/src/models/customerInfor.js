const mongoose = require("mongoose");
const { Schema } = mongoose;

const CustomerInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    districts: { type: String, required: true },
    wards: { type: String, required: true },
    address: { type: String, required: true },
    zipcode: { type: String },
    isDefault: { type: Boolean, default: false }, // Địa chỉ mặc định
  },
  { timestamps: true, versionKey: false }
);

const CustomerInfo =
  mongoose.models.CustomerInfo ||
  mongoose.model("CustomerInfo", CustomerInfoSchema);

module.exports = CustomerInfo;
