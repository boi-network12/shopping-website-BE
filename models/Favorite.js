const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);