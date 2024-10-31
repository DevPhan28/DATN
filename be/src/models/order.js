const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true}
});

const OrderSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
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
            city: { type: String, required: true },
            districts: { type: String, required: true },
            wards: { type: String, required: true },
            address: { type: String, required: true }
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
    statusHistory: { type: [String], default: [] }
}, { timestamps: true, versionKey: false });

OrderSchema.pre('save', async function(next) {
    if (!this.isNew || this.orderNumber) {
        return next();
    }

    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    let attempt = 0;
    let success = false;
    while (!success && attempt < 5) {
        const lastOrder = await this.constructor.findOne({ orderNumber: { $regex: `^${dateString}` } }).sort({ createdAt: -1 });
        const lastOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber.split('-')[3]) : 0;
        this.orderNumber = `${dateString}-${String(lastOrderNumber + 1).padStart(3, '0')}`;
        const existingOrder = await this.constructor.findOne({ orderNumber: this.orderNumber });
        if (!existingOrder) {
            success = true; // Không có đơn hàng trùng lặp, tiếp tục lưu
        } else {
            attempt++; // Tìm thấy đơn hàng trùng lặp, thử lại
        }
    }

    if (!success) {
        throw new Error('Failed to generate unique orderNumber after multiple attempts.');
    }

    next();
});


module.exports = mongoose.model('Order', OrderSchema);
