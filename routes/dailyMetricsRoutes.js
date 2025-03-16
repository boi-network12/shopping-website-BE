// routes/dailyMetricsRoutes.js
const express = require("express");
const { getAllDailyMetrics } = require("../controllers/DailyMetricsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all daily metrics (Admin only)
router.get("/", authMiddleware, getAllDailyMetrics);

module.exports = router;