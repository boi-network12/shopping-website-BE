const express = require("express");
const {
    register,
    login,
    getCurrentUser,
    updateUserInfo,
    getAllUsers,
    deleteUserByAdmin,
    deleteAccount
} = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");
const { addToFavorites, removeFromFavorites, getUserFavorites } = require("../controllers/FavoriteController");

const router = express.Router();

// General routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);
router.put("/update", authMiddleware, updateUserInfo);
router.delete("/delete-account", authMiddleware, deleteAccount);

// Admin routes
router.get("/users", authMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, deleteUserByAdmin);

//  favorite routes
router.post("/add/:productId", authMiddleware, addToFavorites);
router.delete("/remove/:productId", authMiddleware, removeFromFavorites);
router.get("/user-fav", authMiddleware, getUserFavorites);

module.exports = router;
