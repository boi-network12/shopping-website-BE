const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No valid token provided." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.user = user;
        req.isAdmin = user.role === "admin";

        // Allow admins full access, but for users, ensure they can only access their own data
        if (!req.isAdmin && req.params.userId && req.params.userId !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized. You can only access your own data." });
        }

        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;
