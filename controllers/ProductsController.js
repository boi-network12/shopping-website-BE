const Products = require("../models/Products");
const User = require("../models/User");


// Create a product (Admin only)
exports.createProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { productName, price, category, description, image, color, size } = req.body;

        if (!productName || !price || !category || !description) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }

        const product = new Products({
            user: req.user._id,
            productName,
            price,
            category,
            image,
            description,
            color,
            size
        });

        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error("Create Product Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Edit a product (Admin only)
exports.editProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { productId } = req.params;
        const updatedData = req.body;

        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        await Products.findByIdAndUpdate(productId, updatedData, { new: true });
        res.json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Edit Product Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { productId } = req.params;
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        await Products.findByIdAndDelete(productId);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Fetch all products (Everyone can see)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.json(products);
    } catch (error) {
        console.error("Get All Products Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Fetch a single product (Everyone can see)
exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json(product);
    } catch (error) {
        console.error("Get Product By ID Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};
