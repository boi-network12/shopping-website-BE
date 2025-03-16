// controllers/TransactionController.js
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const TransactionController = {
  // Fetch all transactions (Admin only)
  getAllTransactions: async (req, res) => {
    try {
      if (!req.isAdmin) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const transactions = await Transaction.find()
        .populate("user", "email")
        .populate("order")
        .sort({ createdAt: -1 });

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Fetch transactions for a specific user
  getUserTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.find({ user: req.user._id })
        .populate("order")
        .sort({ createdAt: -1 });

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = TransactionController;