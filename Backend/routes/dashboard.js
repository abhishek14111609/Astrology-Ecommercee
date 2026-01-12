const express = require('express');
const db = require('../db');
const router = express.Router();

// Get Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        // Get total revenue from completed orders
        const [revenueResult] = await db.query(
            `SELECT COALESCE(SUM(total_amount), 0) as total_revenue, 
             COUNT(*) as total_orders 
             FROM orders 
             WHERE status = 'completed'`
        );

        // Get total products count
        const [productsResult] = await db.query(
            'SELECT COUNT(*) as total_products FROM products'
        );

        // Get active orders count (pending + processing)
        const [activeOrdersResult] = await db.query(
            `SELECT COUNT(*) as active_orders 
             FROM orders 
             WHERE status IN ('pending', 'processing')`
        );

        // Get total customers count
        const [customersResult] = await db.query(
            `SELECT COUNT(*) as total_customers 
             FROM users 
             WHERE role = 'user'`
        );

        // Calculate revenue change (compare with previous period - simplified)
        const [previousRevenue] = await db.query(
            `SELECT COALESCE(SUM(total_amount), 0) as prev_revenue 
             FROM orders 
             WHERE status = 'completed' 
             AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)`
        );

        const currentRevenue = parseFloat(revenueResult[0].total_revenue);
        const prevRevenue = parseFloat(previousRevenue[0].prev_revenue);
        const revenueChange = prevRevenue > 0
            ? ((currentRevenue - prevRevenue) / prevRevenue * 100).toFixed(1)
            : 0;

        res.json({
            revenue: {
                value: currentRevenue,
                change: revenueChange,
                trend: revenueChange >= 0 ? 'up' : 'down'
            },
            products: {
                value: productsResult[0].total_products,
                change: '+8', // Can be calculated based on historical data
                trend: 'up'
            },
            activeOrders: {
                value: activeOrdersResult[0].active_orders,
                change: '+23', // Can be calculated based on historical data
                trend: 'up'
            },
            customers: {
                value: customersResult[0].total_customers,
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
        const limit = req.query.limit || 5;

        const [orders] = await db.query(
            `SELECT 
                o.id,
                o.order_number,
                o.customer_name,
                o.total_amount,
                o.status,
                o.created_at,
                GROUP_CONCAT(p.name SEPARATOR ', ') as products
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.id
             GROUP BY o.id
             ORDER BY o.created_at DESC
             LIMIT ?`,
            [parseInt(limit)]
        );

        // Format the response
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
                product: order.products || 'No items',
                amount: `₹${parseFloat(order.total_amount).toLocaleString('en-IN')}`,
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
        const limit = req.query.limit || 4;

        const [products] = await db.query(
            `SELECT 
                p.id,
                p.name,
                COUNT(oi.id) as sales,
                SUM(oi.subtotal) as revenue,
                4.5 + (RAND() * 0.5) as rating
             FROM products p
             LEFT JOIN order_items oi ON p.id = oi.product_id
             LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
             GROUP BY p.id
             ORDER BY sales DESC, revenue DESC
             LIMIT ?`,
            [parseInt(limit)]
        );

        // If no products with sales, get bestsellers
        if (products.length === 0 || products[0].sales === 0) {
            const [bestsellers] = await db.query(
                `SELECT 
                    id,
                    name,
                    0 as sales,
                    0 as revenue,
                    4.5 + (RAND() * 0.5) as rating
                 FROM products
                 WHERE is_bestseller = TRUE
                 LIMIT ?`,
                [parseInt(limit)]
            );

            const formattedBestsellers = bestsellers.map(product => ({
                name: product.name,
                sales: 0,
                revenue: '₹0',
                rating: parseFloat(product.rating).toFixed(1)
            }));

            return res.json(formattedBestsellers);
        }

        const formattedProducts = products.map(product => ({
            name: product.name,
            sales: product.sales || 0,
            revenue: `₹${parseFloat(product.revenue || 0).toLocaleString('en-IN')}`,
            rating: parseFloat(product.rating).toFixed(1)
        }));

        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top products', error: error.message });
    }
});

module.exports = router;
