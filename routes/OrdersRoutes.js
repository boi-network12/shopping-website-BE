const express = require("express");
const { createOrder, getAllOrders, getUserOrders, updateOrderStatus } = require("../controllers/OrderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new order
router.post("/", authMiddleware, createOrder);

// Get all orders (Admin only)
router.get("/", authMiddleware, getAllOrders);

// Get orders of the logged-in user
router.get("/user", authMiddleware, getUserOrders);

// Update order status (Admin only)
router.patch("/:orderId/status", authMiddleware, updateOrderStatus);

module.exports = router;
