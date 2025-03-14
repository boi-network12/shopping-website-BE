// notificationRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getUserNotifications, markAsRead, deleteNotifications } = require("../controllers/NotificationController");

const router = express.Router();

router.get("/notifications", authMiddleware, getUserNotifications);
router.put("/notifications/:id/read", authMiddleware, markAsRead);
router.delete("/notifications", authMiddleware, deleteNotifications);

module.exports = router;
