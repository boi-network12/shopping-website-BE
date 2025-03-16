// middleware/updateDailyMetrics.js
const User = require("../models/User");
const DailyMetrics = require("../models/DailyMetrics");

const updateDailyMetrics = async (req, res, next) => {
  try {
    const admin = await User.findOne({ role: "admin" });

    if (admin) {
      const now = new Date();
      const lastUpdated = admin.updatedAt;

      // Check if it's a new day
      if (now.getDate() !== lastUpdated.getDate()) {
        // Save the previous day's metrics to DailyMetrics
        const previousDayMetrics = new DailyMetrics({
          date: lastUpdated,
          totalOrders: admin.dailyOrders,
          totalRevenue: admin.dailyRevenue,
        });
        await previousDayMetrics.save();

        // Reset daily metrics for the new day
        admin.dailyOrders = 0;
        admin.dailyRevenue = 0;
        await admin.save();
      }
    }

    next();
  } catch (error) {
    console.error("Error updating daily metrics:", error);
    next();
  }
};

module.exports = updateDailyMetrics;