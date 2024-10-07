import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  });
  
  const OrderSchema = new mongoose.Schema({
      userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
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
              phone: { type: Number, required: true },
              email: { type: String, required: true },
              payment: { type: Number, required: true },
              city: { type: String, required: true }
          },
          required: true,
      },
      totalPrice: {
          type: Number,
          required: true,
      },
      status: {
          type: String,
          enum: ["pending", "confirmed", "shipped", "canceled"],
          default: "pending",
      },
  }, { timestamps: true, versionKey: false });
  
 // Middleware để tự động tạo orderNumber theo định dạng YYYY-MM-DD-NNN
OrderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // Lấy ngày theo định dạng YYYY-MM-DD
        const lastOrder = await this.constructor.findOne({ orderNumber: { $regex: `^${dateString}` } }).sort({ createdAt: -1 });
        const lastOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber.split('-')[2]) : 0; // Lấy số thứ tự cuối cùng
        this.orderNumber = `${dateString}-${String(lastOrderNumber + 1).padStart(3, '0')}`; // Tạo orderNumber theo định dạng YYYY-MM-DD-NNN
    }
    next();
});

export default mongoose.model('Order', OrderSchema);