// controllers/DailyMetricsController.js
const DailyMetrics = require("../models/DailyMetrics");

const DailyMetricsController = {
  // Get all daily metrics for performance analysis
  getAllDailyMetrics: async (req, res) => {
    try {
      const dailyMetrics = await DailyMetrics.find().sort({ date: -1 });
      res.json(dailyMetrics);
    } catch (error) {
      console.error("Error fetching daily metrics:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = DailyMetricsController;