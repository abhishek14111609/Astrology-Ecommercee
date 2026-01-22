import express from 'express';
import { connect } from '../db.js';
import { getNextSequence } from '../models/Counter.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
const router = express.Router();

// Seed initial data
router.post('/seed-data', async (req, res) => {
    try {
        await connect();
        const results = [];

        // Seed Categories
        const categories = [
            { name: 'Crystals & Gemstones', slug: 'crystals-gemstones', image_url: '/images/categories/crystals.jpg' },
            { name: 'Spiritual Tools', slug: 'spiritual-tools', image_url: '/images/categories/tools.jpg' },
            { name: 'Meditation & Yoga', slug: 'meditation-yoga', image_url: '/images/categories/meditation.jpg' },
            { name: 'Astrology Essentials', slug: 'astrology-essentials', image_url: '/images/categories/astrology.jpg' },
            { name: 'Incense & Oils', slug: 'incense-oils', image_url: '/images/categories/incense.jpg' }
        ];

        // Upsert categories and build slug->id map
        const catMap = {};
        for (const cat of categories) {
            try {
                let existing = await Category.findOne({ slug: cat.slug }).lean();
                if (!existing) {
                    const id = await getNextSequence('categories');
                    const created = await Category.create({ id, ...cat });
                    catMap[cat.slug] = created.id;
                } else {
                    catMap[cat.slug] = existing.id;
                }
                results.push({ type: 'category', name: cat.name, success: true });
            } catch (err) {
                results.push({ type: 'category', name: cat.name, success: false, error: err.message });
            }
        }

        // Seed Products
        const products = [
            {
                name: 'Amethyst Crystal Cluster',
                slug: 'amethyst-crystal-cluster',
                description: 'Natural amethyst cluster for spiritual healing and meditation',
                price: 2499.00,
                category_id: catMap['crystals-gemstones'],
                zodiac_sign: 'Pisces',
                is_bestseller: true,
                tags: JSON.stringify(['Healing', 'Meditation', 'Peace'])
            },
            {
                name: 'Rose Quartz Heart',
                slug: 'rose-quartz-heart',
                description: 'Heart-shaped rose quartz for love and emotional healing',
                price: 1299.00,
                category_id: catMap['crystals-gemstones'],
                zodiac_sign: 'Taurus',
                is_bestseller: true,
                tags: JSON.stringify(['Love', 'Healing', 'Relationships'])
            },
            {
                name: 'Tarot Card Deck - Rider Waite',
                slug: 'tarot-card-deck-rider-waite',
                description: 'Classic Rider-Waite tarot deck for divination',
                price: 1999.00,
                category_id: catMap['spiritual-tools'],
                zodiac_sign: 'Scorpio',
                is_bestseller: false,
                tags: JSON.stringify(['Divination', 'Guidance', 'Spirituality'])
            },
            {
                name: 'Meditation Cushion Set',
                slug: 'meditation-cushion-set',
                description: 'Comfortable cushion set for meditation practice',
                price: 3499.00,
                category_id: catMap['meditation-yoga'],
                zodiac_sign: 'Virgo',
                is_bestseller: false,
                tags: JSON.stringify(['Meditation', 'Comfort', 'Practice'])
            },
            {
                name: 'Zodiac Bracelet - Aries',
                slug: 'zodiac-bracelet-aries',
                description: 'Crystal bracelet designed for Aries energy',
                price: 899.00,
                category_id: catMap['astrology-essentials'],
                zodiac_sign: 'Aries',
                is_bestseller: true,
                tags: JSON.stringify(['Zodiac', 'Energy', 'Protection'])
            },
            {
                name: 'Sage Smudge Stick Bundle',
                slug: 'sage-smudge-stick-bundle',
                description: 'White sage bundle for cleansing and purification',
                price: 599.00,
                category_id: catMap['incense-oils'],
                zodiac_sign: 'Sagittarius',
                is_bestseller: false,
                tags: JSON.stringify(['Cleansing', 'Purification', 'Energy'])
            },
            {
                name: 'Crystal Healing Set',
                slug: 'crystal-healing-set',
                description: 'Complete set of 7 chakra crystals for healing',
                price: 4999.00,
                category_id: catMap['crystals-gemstones'],
                zodiac_sign: 'Aquarius',
                is_bestseller: true,
                tags: JSON.stringify(['Healing', 'Chakra', 'Balance'])
            },
            {
                name: 'Tibetan Singing Bowl',
                slug: 'tibetan-singing-bowl',
                description: 'Handcrafted singing bowl for meditation and sound healing',
                price: 3299.00,
                category_id: catMap['spiritual-tools'],
                zodiac_sign: 'Libra',
                is_bestseller: false,
                tags: JSON.stringify(['Sound Healing', 'Meditation', 'Peace'])
            }
        ];

        for (const product of products) {
            try {
                const existing = await Product.findOne({ slug: product.slug }).lean();
                if (!existing) {
                    const id = await getNextSequence('products');
                    await Product.create({
                        id,
                        ...product,
                        tags: JSON.parse(product.tags),
                        stock: 50,
                    });
                }
                results.push({ type: 'product', name: product.name, success: true });
            } catch (err) {
                results.push({ type: 'product', name: product.name, success: false, error: err.message });
            }
        }

        // Seed a test admin user
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        try {
            const existingAdmin = await User.findOne({ email: 'admin@aurickrystal.com' }).lean();
            if (!existingAdmin) {
                const id = await getNextSequence('users');
                await User.create({ id, name: 'Admin User', email: 'admin@aurickrystal.com', password: hashedPassword, role: 'admin' });
            }
            results.push({ type: 'user', name: 'Admin User', success: true });
        } catch (err) {
            results.push({ type: 'user', name: 'Admin User', success: false, error: err.message });
        }

        // Seed sample customers
        const customerPassword = await bcrypt.hash('customer123', 10);
        const customers = [
            { name: 'Priya Sharma', email: 'priya@example.com', zodiac_sign: 'Aries' },
            { name: 'Rahul Verma', email: 'rahul@example.com', zodiac_sign: 'Taurus' },
            { name: 'Ananya Patel', email: 'ananya@example.com', zodiac_sign: 'Gemini' },
            { name: 'Vikram Singh', email: 'vikram@example.com', zodiac_sign: 'Leo' },
            { name: 'Sneha Reddy', email: 'sneha@example.com', zodiac_sign: 'Virgo' }
        ];

        for (const customer of customers) {
            try {
                const existing = await User.findOne({ email: customer.email }).lean();
                if (!existing) {
                    const id = await getNextSequence('users');
                    await User.create({ id, name: customer.name, email: customer.email, password: customerPassword, role: 'user', zodiac_sign: customer.zodiac_sign });
                }
                results.push({ type: 'customer', name: customer.name, success: true });
            } catch (err) {
                results.push({ type: 'customer', name: customer.name, success: false, error: err.message });
            }
        }

        // Get product and user IDs for orders
        const productRows = await Product.find({}).limit(8).lean();
        const userRows = await User.find({ role: 'user' }).lean();

        // Seed sample orders
        if (productRows.length > 0 && userRows.length > 0) {
            const orders = [
                {
                    user_id: userRows[0]?.id,
                    order_number: 'ORD-2024-001',
                    customer_name: userRows[0]?.name,
                    customer_email: userRows[0]?.email,
                    status: 'completed',
                    payment_status: 'paid',
                    products: [{ id: productRows[0]?.id, name: productRows[0]?.name, price: productRows[0]?.price, quantity: 1 }]
                },
                {
                    user_id: userRows[1]?.id,
                    order_number: 'ORD-2024-002',
                    customer_name: userRows[1]?.name,
                    customer_email: userRows[1]?.email,
                    status: 'processing',
                    payment_status: 'paid',
                    products: [{ id: productRows[1]?.id, name: productRows[1]?.name, price: productRows[1]?.price, quantity: 2 }]
                },
                {
                    user_id: userRows[2]?.id,
                    order_number: 'ORD-2024-003',
                    customer_name: userRows[2]?.name,
                    customer_email: userRows[2]?.email,
                    status: 'pending',
                    payment_status: 'pending',
                    products: [{ id: productRows[2]?.id, name: productRows[2]?.name, price: productRows[2]?.price, quantity: 1 }]
                },
                {
                    user_id: userRows[3]?.id,
                    order_number: 'ORD-2024-004',
                    customer_name: userRows[3]?.name,
                    customer_email: userRows[3]?.email,
                    status: 'completed',
                    payment_status: 'paid',
                    products: [{ id: productRows[3]?.id, name: productRows[3]?.name, price: productRows[3]?.price, quantity: 1 }]
                },
                {
                    user_id: userRows[4]?.id,
                    order_number: 'ORD-2024-005',
                    customer_name: userRows[4]?.name,
                    customer_email: userRows[4]?.email,
                    status: 'completed',
                    payment_status: 'paid',
                    products: [{ id: productRows[4]?.id, name: productRows[4]?.name, price: productRows[4]?.price, quantity: 3 }]
                }
            ];

            for (const order of orders) {
                try {
                    const totalAmount = order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
                    const id = await getNextSequence('orders');
                    await Order.create({
                        id,
                        user_id: order.user_id,
                        order_number: order.order_number,
                        customer_name: order.customer_name,
                        customer_email: order.customer_email,
                        total_amount: totalAmount,
                        status: order.status,
                        payment_status: order.payment_status,
                        items: order.products.map(p => ({
                            product_id: p.id,
                            product_name: p.name,
                            quantity: p.quantity,
                            price: p.price,
                            subtotal: p.price * p.quantity,
                        })),
                    });
                    results.push({ type: 'order', name: order.order_number, success: true });
                } catch (err) {
                    results.push({ type: 'order', name: order.order_number, success: false, error: err.message });
                }
            }
        }

        res.json({
            message: 'Seed data inserted successfully',
            results,
            summary: {
                categories: results.filter(r => r.type === 'category' && r.success).length,
                products: results.filter(r => r.type === 'product' && r.success).length,
                users: results.filter(r => r.type === 'user' && r.success).length,
                customers: results.filter(r => r.type === 'customer' && r.success).length,
                orders: results.filter(r => r.type === 'order' && r.success).length
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error seeding data', error: error.message });
    }
});

export default router;
