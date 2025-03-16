const Order = require("../models/Order");
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
    
        // Send notification to admin
        const adminEmails = ["kamdilichukwu2020@gmail.com"];
        const adminUsers = await User.find({ email: { $in: adminEmails } });
    
        for (const admin of adminUsers) {
          await createNotification(admin._id, "New Order", `A new order has been placed by ${req.user.email}.`, "order", newOrder._id);
        }
    
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
      console.error("Order creation error:", error);
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
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json(orders);
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
