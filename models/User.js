const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String
    },
    // Fields for admin statistics
    dailyVisitors: {
        type: Number,
        default: 0
    },
    dailySignup: {
        type: Number,
        default: 0
    },
    dailyOrders: {
        type: Number,
        default: 0
    },
    dailyRevenue: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String, // Assuming this will be a URL to the image
        default: ""
    },
    ipAddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
