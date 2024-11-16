const mongoose = require("mongoose");
const { Schema } = mongoose;

// Định nghĩa Schema cho Order Item
const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  color: { type: String },
  size: { type: String },
  weight: { type: Number },
});

// Định nghĩa Schema cho Order
const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    orderNumber: {
      type: String,
      unique: true,
    },
    customerInfo: {
      type: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        city: { type: String, required: true },
        districts: { type: String, required: true },
        wards: { type: String, required: true },
        address: { type: String, required: true },
      },
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "received",
        "delivered",
        "canceled",
        "refund",
        "exchange",
        "refund_in_progress",
        "exchange_in_progress",
        "refund_completed",
        "exchange_completed",
      ],
      default: "pending",
    },
    returnReason: {
      type: String,
      required: false,
    },
    paymentCode: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "fail"],
    },
    transactionid: {
      type: String,
      require: false,
    },
    note: {
      type: String,
      require: false,
    },
    statusHistory: { type: [String], default: [] },
    receivedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    // VNPay-specific fields
    vnpayTransactionId: { type: String },
    vnpayResponseCode: { type: String },
    vnpayOrderInfo: { type: String },
    vnpayAmount: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

// Tạo orderNumber tự động
OrderSchema.pre("save", async function (next) {
  if (!this.isNew || this.orderNumber) {
    return next();
  }

  const today = new Date();
  const dateString = today.toISOString().split("T")[0];
  let attempt = 0;
  let success = false;
  while (!success && attempt < 5) {
    const lastOrder = await this.constructor
      .findOne({ orderNumber: { $regex: `^${dateString}` } })
      .sort({ createdAt: -1 });
    const lastOrderNumber = lastOrder
      ? parseInt(lastOrder.orderNumber.split("-")[3])
      : 0;
    this.orderNumber = `${dateString}-${String(lastOrderNumber + 1).padStart(
      3,
      "0"
    )}`;
    const existingOrder = await this.constructor.findOne({
      orderNumber: this.orderNumber,
    });
    if (!existingOrder) {
      success = true;
    } else {
      attempt++;
    }
  }

  if (!success) {
    throw new Error(
      "Failed to generate unique orderNumber after multiple attempts."
    );
  }

  next();
});

// Kiểm tra model đã tồn tại chưa, tránh overwrite model
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports = Order;
