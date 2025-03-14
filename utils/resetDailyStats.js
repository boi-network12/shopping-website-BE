const cron = require("node-cron");
const User = require("../models/User");

const resetDailyStats = async () => {
    try {
        await User.updateMany(
            { role: "admin" }, // Reset only admin stats
            {
                $set: {
                    dailyVisitors: 0,
                    dailySignup: 0,
                    dailyOrders: 0,
                    dailyRevenue: 0,
                },
            }
        );
        console.log("✅ Daily stats reset successfully.");
    } catch (error) {
        console.error("❌ Error resetting daily stats:", error);
    }
};

// Schedule it to run at midnight (00:00 UTC)
cron.schedule("0 0 * * *", resetDailyStats);

module.exports = resetDailyStats;
