const DailyMetrics = require("../models/DailyMetrics");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { createNotification } = require("./NotificationController");

const OrderController = {
  // Create a new order
  createOrder: async (req, res) => {
    try {
        const { cartItems, shippingDetails, shippingMethod, shippingCost, totalAmount, paymentMethod, notes } = req.body;

        if (!cartItems || cartItems.length === 0) {
          return res.status(400).json({ message: "Cart is empty" });
        }

        // Fetch the user who created the order
        const user = await User.findById(req.user._id);
        if (!user) {
          return res.status(404).json({ message: "user not found" })
        }
    
        const newOrder = new Order({
          user: req.user._id,
          cartItems,
          shippingDetails,
          shippingMethod,
          shippingCost,
          totalAmount,
          paymentMethod,
          notes,
        });
    
        await newOrder.save();

        // Create a new transaction
        const newTransaction = new Transaction({
          order: newOrder._id, 
          user: req.user._id, 
          amount: totalAmount,
          status: "completed",
          type: "income",
          paymentMethod, 
          createdBy: user.name
        });

        await newTransaction.save();

        //  update admin daily orders and revenue 
        const admin = await User.findOne({ role: "admin" });
        if (admin) {
          admin.dailyOrders += 1;
          admin.dailyRevenue += totalAmount;
          await admin.save();
        }

        // Update DailyMetrics for the current day
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 

        await DailyMetrics.findOneAndUpdate(
          { date: startOfDay },
          {
            $inc: { totalOrders: 1, totalRevenue: totalAmount }, 
          },
          { upsert: true, new: true }
        );
    
        // Send notification to admin
        const adminEmails = ["kamdilichukwu2020@gmail.com"];
        const adminUsers = await User.find({ email: { $in: adminEmails } });
    
        for (const admin of adminUsers) {
          await createNotification(admin._id, "New Order", `A new order has been placed by ${req.user.email}.`, "order", newOrder._id);
        }
    
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
      console.error("Order creation error:", error);
      // If order creation fails, create a failed transaction
      const { totalAmount } = req.body;
      const user = await User.findById(req.user._id);
      if (user) {
        const failedTransaction = new Transaction({
          order: null, // No order associated with a failed transaction
          user: req.user._id,
          amount: totalAmount,
          status: "failed", // Set status to "failed"
          type: "outcome", // Set type to "outcome"
          paymentMethod: req.body.paymentMethod,
          createdBy: user.name, // Include the name of the person who created the order
        });

        await failedTransaction.save();
      }

      res.status(500).json({ message: "Server error" });
    }
  },

  // Get all orders (Admin only)
  getAllOrders: async (req, res) => {
    try {
      if (!req.isAdmin) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const orders = await Order.find().populate("user", "email").sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Get user's orders
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user._id; // Get the user ID from the request
  
      // Fetch orders for the logged-in user
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  
      // If no orders are found, return an empty array
      if (!orders || orders.length === 0) {
        return res.status(200).json([]);
      }
  
      // Return the orders
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Update order status (Admin only)
  updateOrderStatus: async (req, res) => {
    try {
      if (!req.isAdmin) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.status = status;
      await order.save();

      res.json({ message: "Order status updated", order });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

    // delete function
    deleteOrder: async (req, res) => {
        try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await Order.findByIdAndDelete(orderId);
        res.json({ message: "Order deleted successfully" });
        } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Server error" });
        }
    },
};

module.exports = OrderController;
