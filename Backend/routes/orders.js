import express from 'express';
import { connect } from '../db.js';
import Order from '../models/Order.js';
import { getNextSequence } from '../models/Counter.js';
import { authenticateToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const tryAttachUserFromToken = (req) => {
    const token = req.cookies?.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
    if (!token || !JWT_SECRET) return;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        // Ignore invalid/expired tokens for guest checkout
    }
};

// Create new order
router.post('/', async (req, res) => {
    try {
        tryAttachUserFromToken(req);
        const { items, customer_details } = req.body;
        // User is optional (guest checkout), but if token is present, we can link it.
        // For now, let's assume we receive user_id if logged in, or handle it via token if passed.
        // Ideally, if authenticated, we get user_id from req.user

        // Wait, the frontend might be sending headers with token if logged in.
        // We'll try to extract user from token if available, but not enforce it for guest checkout?
        // Actually, let's keep it simple. If the user is logged in, they send the token. 
        // We can make a middleware that is optional auth? 
        // For now, let's assume the frontend passes user_id in body or we just use email.

        /* 
           Simple "Optional Auth" logic:
           If Authorization header exists, verify it. If valid, set req.user.
        */

        await connect();

        // Calculate total and validate items
        let total_amount = 0;
        const processedItems = [];

        for (const item of items) {
            const product = await Product.findOne({ id: item.id }).lean();
            if (!product) continue;

            const price = product.price; // Use backend price for security
            const subtotal = price * item.quantity;
            total_amount += subtotal;

            processedItems.push({
                product_id: product.id,
                product_name: product.name,
                quantity: item.quantity,
                price: price,
                subtotal: subtotal
            });
        }

        const id = await getNextSequence('orders');
        const orderNumber = `AK-${100000 + id}`;

        // Handle user_id if provided (e.g. from frontend context)
        const user_id = req.user?.id || req.body.user_id || null;

        // Safely handle customer name
        let customerName = 'Guest';
        if (customer_details && customer_details.firstName && customer_details.lastName) {
            customerName = `${customer_details.firstName} ${customer_details.lastName}`;
        } else if (customer_details && customer_details.fullName) {
            customerName = customer_details.fullName;
        }

        const newOrder = await Order.create({
            id,
            user_id,
            order_number: orderNumber,
            customer_name: customerName,
            customer_email: customer_details?.email || null,
            customer_phone: customer_details?.phone || null,
            customer_address: customer_details?.address || null,
            total_amount,
            status: 'pending',
            payment_status: 'paid', // Assuming payment gateway success for now
            items: processedItems
        });

        res.status(201).json({ message: 'Order created', order: newOrder });

    } catch (error) {
        console.error("Order Create Error:", error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
});

// Get My Orders
router.get('/myorders', authenticateToken, async (req, res) => {
    try {
        await connect();
        const orders = await Order.find({ user_id: req.user.id }).sort({ created_at: -1 }).lean();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Get Single Order (Tracking)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await connect();

        let order;
        // Check if id is numeric (internal id) or string (order number)
        if (id.startsWith('AK-')) {
            order = await Order.findOne({ order_number: id }).lean();
        } else {
            order = await Order.findOne({ id: parseInt(id) }).lean();
        }

        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

export default router;
