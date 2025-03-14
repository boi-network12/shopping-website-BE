const Favorite = require("../models/Favorite");
const Products = require("../models/Products");


// Add to favorites
exports.addToFavorites = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
        if (existingFavorite) {
            return res.status(400).json({ message: "Product already in favorites." });
        }

        const favorite = new Favorite({ user: userId, product: productId });
        await favorite.save();

        res.status(201).json({ message: "Product added to favorites.", favorite });
    } catch (error) {
        console.error("Add to Favorites Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Remove from favorites
exports.removeFromFavorites = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId });
        if (!favorite) {
            return res.status(404).json({ message: "Product not found in favorites." });
        }

        res.json({ message: "Product removed from favorites." });
    } catch (error) {
        console.error("Remove from Favorites Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Get user favorites
exports.getUserFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        const favorites = await Favorite.find({ user: userId }).populate("product");
        res.json(favorites);
    } catch (error) {
        console.error("Get User Favorites Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};