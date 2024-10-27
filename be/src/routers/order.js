const express = require("express");
const {
    getOrderById,
    getOrders,
    updateOrder,
    deleteOrder,
    createOrder
} = require("../controllers/order");
const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getOrders);
router.get("/orders/:userId/:orderId", getOrderById);
module.exports = router;