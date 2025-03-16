// routes/transactionRoutes.js
const express = require("express");
const { getAllTransactions, getUserTransactions } = require("../controllers/TransactionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all transactions (Admin only)
router.get("/", authMiddleware, getAllTransactions);

// Get transactions for the logged-in user
router.get("/user", authMiddleware, getUserTransactions);

module.exports = router;