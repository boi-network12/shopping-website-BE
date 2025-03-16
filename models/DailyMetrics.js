// models/DailyMetrics.js
const mongoose = require("mongoose");

const DailyMetricsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true, // Ensure only one entry per day
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyMetrics", DailyMetricsSchema);