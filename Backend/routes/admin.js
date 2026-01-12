const express = require('express');
const db = require('../db');
const router = express.Router();

const { authenticateToken, isAdmin } = require('../middleware/auth');

// --- Product Management ---
router.post('/products', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, slug, description, price, category_id, sub_category_id, zodiac_sign, image_url, is_bestseller, tags } = req.body;
        const [result] = await db.query(
            'INSERT INTO products (name, slug, description, price, category_id, sub_category_id, zodiac_sign, image_url, is_bestseller, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, slug, description, price, category_id, sub_category_id, zodiac_sign, image_url, is_bestseller, JSON.stringify(tags)]
        );
        res.status(201).json({ message: 'Product created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// --- Category Management ---
router.post('/categories', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, slug, image_url } = req.body;
        const [result] = await db.query('INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)', [name, slug, image_url]);
        res.status(201).json({ message: 'Category created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
});

// --- Sub-category Management ---
router.post('/subcategories', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { category_id, name, slug } = req.body;
        const [result] = await db.query('INSERT INTO sub_categories (category_id, name, slug) VALUES (?, ?, ?)', [category_id, name, slug]);
        res.status(201).json({ message: 'Sub-category created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating sub-category', error: error.message });
    }
});

// --- Quiz Management ---
router.post('/quiz/questions', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { question_text, step_order } = req.body;
        const [result] = await db.query('INSERT INTO quiz_questions (question_text, step_order) VALUES (?, ?)', [question_text, step_order]);
        res.status(201).json({ message: 'Question created', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating question', error: error.message });
    }
});

module.exports = router;
