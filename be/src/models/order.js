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
        zipcode: { type: String }, // Thêm nếu cần
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
        "pendingPayment",
        "confirmed",
        "shipped",
        "received",
        "delivered",
        "canceled",
        "complaint",
        "refund_in_progress",
        "exchange_in_progress",
        "refund_completed",
        "exchange_completed",
      ],
      default: "pending",
    },
    returnReason: String,
    complaintDetails: String, // Thêm thông tin khiếu nại nếu cần
    paymentCode: String,
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "processing"], 
      default: "pending",
    },
    transactionid: { type: String }, // Mã giao dịch ZaloPay
    zalopayResponseCode: { type: String }, // Mã phản hồi từ ZaloPay
    zalopayOrderInfo: { type: String }, // Thông tin đơn hàng từ ZaloPay
    zalopayAmount: { type: Number }, // Số tiền thanh toán qua ZaloPay
    zalopayTimestamp: { type: Number }, // Thời gian giao dịch qua ZaloPay
    note: String,
    statusHistory: { type: [String], default: [] },
    receivedAt: Date,
    createdAt: { type: Date, default: Date.now },
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
