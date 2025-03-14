const User = require("../models/User");
const Visitor = require("../models/Visitor");


const getPublicIp = async (req) => {
    return req.ip || req.headers['x-forwarded-for'] || "Unknown IP";
};

const trackVisitor = async (req, res, next) => {
    try {
        const ipAddress = await getPublicIp(req);

        const visitor = await Visitor.findOneAndUpdate(
            { ipAddress },
            { 
                $inc: { visitCount: 1 }, 
                $set: { lastVisited: Date.now() } 
            },
            { upsert: true, new: true } // If no document exists, create one
        );

        // Update daily visitors count in the admin stats
        const admin = await User.findOne({ role: "admin" });
        if (admin) {
            admin.dailyVisitors += 1;
            await admin.save();
        }

        next();
    } catch (error) {
        console.error("Error tracking visitor:", error.message);
        next();
    }
};


module.exports = trackVisitor;
