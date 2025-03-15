const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        image: String,
        selectedSize: String,
        selectedColor: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    shippingDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      altPhone: { type: String },
      email: { type: String, required: true },
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String },
      address: { type: String, required: true },
    },
    shippingMethod: {
      type: String,
      enum: ["flatRate", "customerPickUp"],
      default: "flatRate",
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 1000,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["payOnline", "cashOnDelivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
