const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true,
        unique: true
    },
    visitCount: {
        type: Number,
        default: 1
    },
    lastVisited: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Visitor", VisitorSchema);
