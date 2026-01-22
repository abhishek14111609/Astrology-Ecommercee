import express from 'express';
import { connect } from '../db.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
const router = express.Router();

// Get Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        await connect();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const revAgg = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total_revenue: { $sum: '$total_amount' }, total_orders: { $sum: 1 } } }
        ]);
        const currentRevenue = parseFloat((revAgg[0]?.total_revenue || 0));

        const prevAgg = await Order.aggregate([
            { $match: { status: 'completed', created_at: { $lt: sevenDaysAgo } } },
            { $group: { _id: null, prev_revenue: { $sum: '$total_amount' } } }
        ]);
        const prevRevenue = parseFloat((prevAgg[0]?.prev_revenue || 0));
        const revenueChange = prevRevenue > 0
            ? ((currentRevenue - prevRevenue) / prevRevenue * 100).toFixed(1)
            : 0;

        const totalProducts = await Product.countDocuments();
        const activeOrders = await Order.countDocuments({ status: { $in: ['pending', 'processing'] } });
        const totalCustomers = await User.countDocuments({ role: 'user' });

        res.json({
            revenue: {
                value: currentRevenue,
                change: revenueChange,
                trend: revenueChange >= 0 ? 'up' : 'down'
            },
            products: {
                value: totalProducts,
                change: '+8', // Can be calculated based on historical data
                trend: 'up'
            },
            activeOrders: {
                value: activeOrders,
                change: '+23', // Can be calculated based on historical data
                trend: 'up'
            },
            customers: {
                value: totalCustomers,
                change: '-3.2', // Can be calculated based on historical data
                trend: 'down'
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
    }
});

// Get Recent Orders
router.get('/recent-orders', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit || 5);
        await connect();
        const orders = await Order.find({}).sort({ created_at: -1 }).limit(limit).lean();

        const formattedOrders = orders.map(order => {
            const now = new Date();
            const orderDate = new Date(order.created_at);
            const diffMs = now - orderDate;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            let timeAgo;
            if (diffMins < 60) {
                timeAgo = `${diffMins} mins ago`;
            } else if (diffHours < 24) {
                timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else {
                timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            }

            return {
                id: order.order_number,
                customer: order.customer_name,
                product: (order.items || []).map(i => i.product_name).join(', ') || 'No items',
                amount: `₹${parseFloat(order.total_amount || 0).toLocaleString('en-IN')}`,
                status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
                time: timeAgo
            };
        });

        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent orders', error: error.message });
    }
});

// Get Top Products
router.get('/top-products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit || 4);
        await connect();

        // Aggregate order items across orders
        const agg = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product_id', sales: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
            { $sort: { sales: -1, revenue: -1 } },
            { $limit: limit }
        ]);

        if (!agg.length) {
            const bestsellers = await Product.find({ is_bestseller: true }).limit(limit).lean();
            const formattedBestsellers = bestsellers.map(product => ({
                name: product.name,
                sales: 0,
                revenue: '₹0',
                rating: (4.5 + Math.random() * 0.5).toFixed(1)
            }));
            return res.json(formattedBestsellers);
        }

        const productIds = agg.map(a => a._id);
        const products = await Product.find({ id: { $in: productIds } }).lean();
        const map = Object.fromEntries(products.map(p => [p.id, p.name]));
        const formattedProducts = agg.map(a => ({
            name: map[a._id] || `Product ${a._id}`,
            sales: a.sales || 0,
            revenue: `₹${parseFloat(a.revenue || 0).toLocaleString('en-IN')}`,
            rating: (4.5 + Math.random() * 0.5).toFixed(1)
        }));

        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top products', error: error.message });
    }
});

export default router;
