const express = require("express");
const { createProduct, editProduct, deleteProduct, getAllProducts, getProductById } = require("../controllers/ProductsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createProduct); // Admin only
router.put("/edit/:productId", authMiddleware, editProduct); // Admin only
router.delete("/delete/:productId", authMiddleware, deleteProduct); // Admin only
router.get("/all", getAllProducts); // Everyone can see
router.get("/:productId", getProductById); // Everyone can see

module.exports = router;
