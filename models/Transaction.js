const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["income", "outcome"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["payOnline", "cashOnDelivery"],
      required: true,
    },
    createdBy: {
      type: String, // Name of the person who created the order
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);