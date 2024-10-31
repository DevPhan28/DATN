const express = require("express");
const {
    getOrderById,
    getOrders,
    updateOrder,
    deleteOrder,
    createOrder,
    getOrdersByUserId
} = require("../controllers/order");
const router = express.Router();

router.post("/orders", createOrder);

router.get("/orders", getOrders);


router.get("/orders/:userId/:orderId", getOrderById);

router.get('/orders/:userId', getOrdersByUserId);
router.put("/orders/:orderId", updateOrder);

router.delete("/orders/:userId/:orderId", deleteOrder);

module.exports = router;
