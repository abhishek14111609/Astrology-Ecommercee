const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const setupRoutes = require('./routes/setup');
const seedRoutes = require('./routes/seed');
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Auric Krystal Backend is running...');
});

// Health check to test DB connection
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'OK', database: 'Connected', solution: rows[0].solution });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Database Connection Failed', error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
