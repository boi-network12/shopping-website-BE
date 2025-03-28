const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/UserRoutes');
const NotificationRoutes = require('./routes/NotificationRoutes');
const ProductsRoutes = require('./routes/products');
const OrderRoutes = require('./routes/OrdersRoutes');
const TransactionRoutes = require('./routes/transactionRoutes');
const dailyMetricsRoutes = require('./routes/dailyMetricsRoutes');
const resetDailyStats = require('./utils/resetDailyStats');
const trackVisitor = require('./middleware/VisitorMiddleware');


dotenv.config();

const app = express();

connectDB();

// Start the reset job
resetDailyStats();

const allowedOrigins = [
    "https://shopping-website-three-orpin.vercel.app",
    "http://localhost:3000"
]

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use(express.json());

//  Apply middleware to track visitors
app.use(trackVisitor);

//  routes 
app.use('/auth', authRoutes)
app.use('/', NotificationRoutes)
app.use('/product', ProductsRoutes)
app.use("/orders", OrderRoutes)
app.use("/transactions", TransactionRoutes)
app.use("/daily-metrics", dailyMetricsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sever running on port ${PORT}`)
})