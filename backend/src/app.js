const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const couponRoutes = require('./routes/couponRoutes');
const shipperRoutes = require('./routes/shipperRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

const corsOptions = {
    origin:
        process.env.NODE_ENV === 'production'
            ? [process.env.FRONTEND_URL].filter(Boolean)
            : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests from this IP, please try again later' },
});

// KHONG apply limiter cho payment webhook
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/wishlist', apiLimiter, wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/coupons', apiLimiter, couponRoutes);
app.use('/api/shipper', apiLimiter, shipperRoutes);

app.get('/', (req, res) => {
    res.send('API is running securely...');
});

app.use(errorMiddleware);

module.exports = app;
