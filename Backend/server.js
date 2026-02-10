import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { mongoose, connect } from './db.js';

const app = express();
const PORT = process.env.PORT;
import authRoutes from './routes/auth.js';

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5175', 'https://aurickrystal.com', 'https://www.aurickrystal.com', 'https://admin.aurickrystal.com'], // Frontend and Admin ports
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Routes
import productRoutes from './routes/products.js';
import adminRoutes from './routes/admin.js';
import setupRoutes from './routes/setup.js';
import seedRoutes from './routes/seed.js';
import dashboardRoutes from './routes/dashboard.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';
import paymentRoutes from './routes/payment.js';
import adminPaymentRoutes from './routes/admin-payments.js';
import serviceBookingRoutes from './routes/service-bookings.js';
import notificationRoutes from './routes/notifications.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin/payments', adminPaymentRoutes);
app.use('/api/service-bookings', serviceBookingRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Auric krystals Backend is running...');
});

// Health check to test DB connection
app.get('/api/health', async (req, res) => {
    try {
        await connect();
        // basic ping via admin command
        const admin = mongoose.connection.getClient().db().admin();
        await admin.ping();
        res.json({ status: 'OK', database: 'MongoDB Connected' });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Database Connection Failed', error: error.message });
    }
});

// Start Server
connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
            console.log("mongodb connected sucessfully")
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });
