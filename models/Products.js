const mongoose = require("mongoose");

const ProductsSchema = mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    productName: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Array,
        required: true
    },
    image: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

module.exports = mongoose.model("Products", ProductsSchema);