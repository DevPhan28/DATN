const Order = require('../models/order') ;
const { StatusCodes } = require("http-status-codes") ;


const createOrder = async (req, res) => {
    try {
        const { userId, items, totalPrice, customerInfo } = req.body;
        // Thử tạo một đơn hàng mới sử dụng dữ liệu cung cấp trong body của yêu cầu
        const order = await Order.create({ userId, items, totalPrice, customerInfo });

        // Nếu thành công, gửi lại đơn hàng mới được tạo với mã trạng thái 201
        return res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
        // Xử lý lỗi mở rộng để cung cấp phản hồi thông tin hơn tùy thuộc vào loại lỗi
        if (error.name === 'ValidationError') {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        } else if (error.code === 11000) {
            // Xử lý cụ thể các lỗi khóa trùng lặp (ví dụ, số đơn hàng trùng)
            return res.status(StatusCodes.CONFLICT).json({ error: "Một đơn hàng với định danh này đã tồn tại." });
        } else {
            // Đối với tất cả các loại lỗi khác, trả về lỗi máy chủ nội bộ 500
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
};

//lấy all thông tin đặt hàng
 const getOrders = async (req, res) => {
    try {
        const order = await Order.find();
        if (order.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "No orders found" });
        }
        return res.status(StatusCodes.OK).json(order);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
//lấy 1 id
 const getOrderById = async (req, res) => {
    try {
        const { userId, orderId } = req.params;
        const order = await Order.findOne({ userId, _id: orderId });
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
        }
        return res.status(StatusCodes.OK).json(order);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOneAndUpdate({ _id: orderId }, req.body, {
            new: true,
        });
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
        }
        return res.status(StatusCodes.OK).json(order);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
const deleteOrder = async (req, res) => {
    try {
        const { userId, orderId } = req.params;
        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
        }
        if (!order.status === "pending") {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Order delete successfully" });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

module.exports = {
    getOrderById,
    getOrders,
    updateOrder,
    deleteOrder,
    createOrder
  };