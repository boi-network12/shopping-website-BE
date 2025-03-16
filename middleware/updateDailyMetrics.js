// middleware/updateDailyMetrics.js
const User = require("../models/User");

const updateDailyMetrics = async (req, res, next) => {
  try {
    const admin = await User.findOne({ role: "admin" });

    if (admin) {
      // Reset daily metrics at the start of a new day
      const now = new Date();
      const lastUpdated = admin.updatedAt;

      if (now.getDate() !== lastUpdated.getDate()) {
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