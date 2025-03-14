const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createNotification } = require('./NotificationController');



const allowedAdmin = [
    'kamdilichukwu2020@gmail.com'
]

const getPublicIp = async () => {
    try {
        const response = await fetch("https://api64.ipify.org?format=json"); // No need for 'node-fetch' in Node.js 18+
        if (!response.ok) {
            throw new Error(`Error fetching IP: ${response.statusText}`);
        }
        const data = await response.json();
        return data.ip || "Unknown IP";
    } catch (error) {
        console.error("Error fetching public IP:", error.stack);
        return "Unknown IP";
    }
};


// Register user and update the admin
exports.register = async (req, res) => {
    try {
        const { name, email, password, country } = req.body;

        // Check if any admin exists
        const adminExists = await User.findOne({ role: 'admin' });

        // If no admin exists and the current user is NOT in allowedAdmin, block registration
        if (!adminExists && !allowedAdmin.includes(email)) {
            return res.status(403).json({ message: "Admin account must be created first." });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Get IP Address
        const ipAddress = await getPublicIp();

        // Determine role (first admin is allowed, others are users)
        const role = !adminExists && allowedAdmin.includes(email) ? "admin" : "user";

        // Create user
        user = new User({
            name,
            email,
            password: hashPassword,
            country,
            ipAddress,
            role
        });

        await user.save();

        // If an admin exists, update admin stats
        if (adminExists) {
            adminExists.dailySignup += 1;
            await adminExists.save();

            // Send notification to the admin
            await createNotification(
                adminExists._id,
                "New User sign up",
                `${name} just signed up!`
            );
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ message: "User registered successfully", token, user });
    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Get IP Address
        const ipAddress = await getPublicIp();

        // Update user's IP Address
        user.ipAddress = ipAddress;
        await user.save();

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

//  get currentUser 
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (error) {
        console.error("Fetch User Info Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
}

//  Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ message: "Account deleted successfully." });
    } catch (error) {
        console.error("Delete Account Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Update user info
exports.updateUserInfo = async (req, res) => {
    try {
        const { name, email, password, country, state, city, address, phone } = req.body;
        const userId = req.user.id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the new email is already taken (except for the current user)
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email is already in use." });
            }
            user.email = email;
        }

        // Hash password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Update other fields if provided
        if (name) user.name = name;
        if (country) user.country = country;
        if (state) user.state = state;
        if (city) user.city = city;
        if (address) user.address = address;
        if (phone) user.phone = phone;

        await user.save();

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Update User Info Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error("Get All Users Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Admin delete user
exports.deleteUserByAdmin = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Admin Delete User Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};