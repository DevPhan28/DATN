const Mail = require("../helpers/node-mailler");
const Order = require("../models/order");
const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, customerInfo } = req.body;

    // Tạo đơn hàng mới với `color` và `size` trong từng `item`
    const order = await Order.create({
      userId,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        color: item.variant?.color || item.color, // Lấy color từ variant hoặc item
        size: item.variant?.size || item.size,
        weight: item.variant?.weight || item.weight,
      })),
      totalPrice,
      customerInfo,
    });

    // Cập nhật `countInStock` cho mỗi sản phẩm
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { countInStock: -item.quantity } },
        { new: true }
      );
    }

    // Gửi email xác nhận đơn hàng
    await Mail.sendOrderConfirmation(customerInfo.email, order);

    return res.status(StatusCodes.CREATED).json(order);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error.code === 11000) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "Một đơn hàng với định danh này đã tồn tại." });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
};

const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(filter);

    // Trả về mảng trống nếu không có đơn hàng nào
    if (totalOrders === 0) {
      return res.status(StatusCodes.OK).json({
        data: [],
        meta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: Number(page),
          pageSize: Number(limit),
        },
      });
    }

    return res.status(StatusCodes.OK).json({
      data: orders,
      meta: {
        totalItems: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: Number(page),
        pageSize: Number(limit),
      },
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const order = await Order.findOne({ userId, _id: orderId });
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }
    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm kiếm các đơn hàng theo userId
    const orders = await Order.find({ userId });

    // Nếu không có đơn hàng nào, trả về mảng trống
    if (!orders || orders.length === 0) {
      return res.status(StatusCodes.OK).json([]); // Trả về mảng trống thay vì lỗi
    }

    // Kiểm tra và log chi tiết các thuộc tính của từng sản phẩm
    orders.forEach((order) => {
      order.items.forEach((item) => {
        console.log(`Order item:`, item);
        if (!item.color || !item.size) {
          console.warn(`Order item missing color or size: ${item.name}`);
        }
      });
    });

    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Kiểm tra xem order có tồn tại không
    console.log(
      `Updating order status for orderId: ${orderId} to status: ${status}`
    );
    const order = await Order.findById(orderId);

    if (!order) {
      console.warn(`Order with id ${orderId} not found.`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }

    // Cập nhật trạng thái nếu khác trạng thái hiện tại
    if (order.status !== status) {
      console.log(`Current status: ${order.status}, New status: ${status}`);
      order.statusHistory.push(order.status);
      order.status = status;
      await order.save();
      console.log("Order status updated and saved.");
    } else {
      console.log(
        "Status is the same as the current status. No update necessary."
      );
    }

    // Gửi email thông báo nếu có email khách hàng
    if (order.customerInfo && order.customerInfo.email) {
      console.log(`Sending status update email to ${order.customerInfo.email}`);
      await Mail.sendOrderStatusUpdate(order.customerInfo.email, order);
    } else {
      console.warn("Customer email not found. Skipping email notification.");
    }

    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }
    if (!order.status === "pending") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order delete successfully" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  // Kiểm tra nếu orderId không tồn tại hoặc không hợp lệ
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    return res
      .status(400)
      .json({ message: "Thiếu hoặc sai định dạng orderId" });
  }

  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(orderId);

    // Kiểm tra nếu đơn hàng không tồn tại
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra trạng thái của đơn hàng, chỉ cho phép hủy nếu trạng thái là "pending"
    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Đơn hàng đã được xác nhận hoặc đang xử lý, không thể hủy",
      });
    }

    // Cập nhật trạng thái thành "canceled"
    order.status = "canceled";
    await order.save();
    res.status(200).json({ message: "Đơn hàng đã được hủy thành công", order });
    if (order.customerInfo && order.customerInfo.email) {
      console.log(`Sending status update email to ${order.customerInfo.email}`);
      await Mail.sendOrderStatusUpdate(order.customerInfo.email, order);
    } else {
      console.warn("Customer email not found. Skipping email notification.");
    }
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi hủy đơn hàng",
      error: error.message || error,
    });
  }
};

// In your orders controller
const confirmReceived = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow update if the status is 'received'
    if (order.status !== "received") {
      return res.status(400).json({
        message: "Only received orders can be confirmed as delivered",
      });
    }

    order.status = "delivered"; // Cập nhật trạng thái từ 'received' sang 'delivered'
    await order.save();

    if (order.customerInfo && order.customerInfo.email) {
      console.log(`Sending status update email to ${order.customerInfo.email}`);
      await Mail.sendOrderStatusUpdate(order.customerInfo.email, order);
    } else {
      console.warn("Customer email not found. Skipping email notification.");
    }

    res.json({ message: "Order status updated to delivered" });
  } catch (error) {
    res.status(500).json({ message: "Error confirming order received" });
  }
};

const setDelivered = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Nếu trạng thái là "received" và chưa có `receivedAt`, thiết lập thời gian hiện tại
    if (order.status === "received" && !order.receivedAt) {
      order.receivedAt = new Date();
      console.log(
        `Đặt receivedAt cho đơn hàng ${order._id} là ${order.receivedAt}`
      );
    }

    // Cập nhật trạng thái thành "delivered" ngay khi người dùng xác nhận
    order.status = "delivered";
    await order.save();

    res.status(200).json({
      message: "Order status updated to delivered",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order to delivered", error });
  }
};
const returnOrder = async (req, res) => {
  const { orderId } = req.params; // Lấy orderId từ params
  const { reason, returnType } = req.body; // Lấy lý do và loại hoàn trả từ body

  try {
    const order = await Order.findById(orderId); // Tìm đơn hàng theo orderId

    // Nếu không tìm thấy đơn hàng
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra trạng thái của đơn hàng, chỉ cho phép hoàn trả nếu đã giao hoặc đã nhận
    if (order.status !== "delivered" && order.status !== "received") {
      return res.status(400).json({
        message: "Chỉ có thể hoàn trả đơn hàng đã giao hoặc đã nhận",
      });
    }

    // Kiểm tra loại yêu cầu hoàn trả (refund hoặc exchange)
    if (returnType === "refund") {
      order.status = "refund"; // Cập nhật trạng thái đơn hàng thành refund
    } else if (returnType === "exchange") {
      order.status = "exchange"; // Cập nhật trạng thái đơn hàng thành exchange
    } else {
      return res.status(400).json({
        message: "Loại yêu cầu hoàn trả không hợp lệ", // Trả về lỗi nếu loại không hợp lệ
      });
    }

    order.returnReason = reason; // Lưu lý do hoàn trả vào đơn hàng
    await order.save(); // Lưu lại thay đổi vào cơ sở dữ liệu

    // Trả về phản hồi thành công
    res.status(200).json({
      message: `Đơn hàng đã được ${
        returnType === "refund" ? "trả hàng hoàn tiền" : "đổi trả"
      } thành công`,
      order, // Trả lại thông tin đơn hàng đã cập nhật
    });
  } catch (error) {
    // Nếu có lỗi xảy ra
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi hoàn trả đơn hàng", error });
  }
};

const updateReturnReason = async (req, res) => {
  try {
    const { id } = req.params;
    const { returnReason, status } = req.body;

    // Kiểm tra xem lý do và trạng thái có hợp lệ không
    if (!returnReason) {
      return res.status(400).json({ message: "Return reason is required." });
    }
    if (!["refund", "exchange", "return_completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status for return." });
    }

    // Tìm và cập nhật đơn hàng với lý do trả hàng và trạng thái
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Cập nhật lý do và trạng thái trả hàng
    order.returnReason = returnReason;
    order.status = status;
    order.statusHistory.push(status); // Lưu lịch sử trạng thái

    await order.save();

    res.status(200).json({
      message: "Order updated with return reason and status.",
      order,
    });
  } catch (error) {
    console.error("Error updating return reason:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getOrderById,
  confirmReceived,
  getOrders,
  updateOrder,
  deleteOrder,
  createOrder,
  getOrdersByUserId,
  cancelOrder,
  setDelivered,
  returnOrder,
  updateReturnReason,
};
