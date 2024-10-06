import Order from '../models/order';
import { StatusCodes } from "http-status-codes";

export const createOrder = async (req, res) => {
    try {
        const { userId, items, totalPrice, customerInfo } = req.body;
        const order = await Order.create({ userId, items, totalPrice, customerInfo });
        return res.status(StatusCodes.CREATED).json(order);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
//lấy all thông tin đặt hàng
export const getOrders = async (req, res) => {
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
export const getOrderById = async (req, res) => {
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
export const updateOrder = async (req, res) => {
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
export const deleteOrder = async (req, res) => {
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