const Notification = require("../models/Notification")


exports.createNotification = async (userId, title, message ) => {
    try {
        const newNotification = await Notification({
            user: userId,
            title,
            message
        });

        await newNotification.save();
    } catch (error) {
        console.error("Notification Error:", error.message);
    }
}

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error("Fetch Notifications Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
}

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }

        notification.read = true;
        await notification.save();

        res.json({ message: "Notification marked as read." });
    } catch (error) {
        console.error("Mark As Read Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

exports.deleteNotifications = async (req, res) => {
    try {
      await Notification.deleteMany({ _id: { $in: req.body.ids }, user: req.user.id });
      res.json({ message: "Notifications deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Server error." });
    }
  };

  