import express from 'express';
const router = express.Router();
import { connect } from '../db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Initialize Database with Schema
router.post('/init-database', async (req, res) => {
    try {
        await connect();
        // With MongoDB + Mongoose, collections are created dynamically.
        // We simply ensure indexes are initialized by touching the models.
        await Promise.all([
            User.init(), Category.init(), SubCategory.init(), Product.init(), Order.init()
        ]);
        res.json({ message: 'MongoDB initialized', initialized: true, totalStatements: 0, results: [] });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing database', error: error.message });
    }
});

// Check Database Status
router.get('/database-status', async (req, res) => {
    try {
        await connect();
        const status = {};
        const withCount = async (name, model) => {
            try {
                const count = await model.countDocuments();
                status[name] = { exists: true, count };
            } catch (err) {
                status[name] = { exists: false, error: err.message };
            }
        };

        await Promise.all([
            withCount('users', User),
            withCount('categories', Category),
            withCount('sub_categories', SubCategory),
            withCount('products', Product),
            withCount('orders', Order),
            // placeholders for collections not modeled yet
            Promise.resolve(status['quiz_questions'] = { exists: false, count: 0 }),
            Promise.resolve(status['quiz_options'] = { exists: false, count: 0 }),
            Promise.resolve(status['order_items'] = { exists: false, count: 0 }),
            Promise.resolve(status['cart'] = { exists: false, count: 0 }),
            Promise.resolve(status['wishlist'] = { exists: false, count: 0 }),
        ]);

        res.json({ status, database: 'auric_krystals_mongo' });
    } catch (error) {
        res.status(500).json({ message: 'Error checking database status', error: error.message });
    }
});

export default router;
