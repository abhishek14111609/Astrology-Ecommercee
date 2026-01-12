const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
    try {
        const { category, subcategory, zodiac, is_bestseller } = req.query;
        let query = 'SELECT p.*, c.name as category_name, s.name as subcategory_name FROM products p ';
        query += 'LEFT JOIN categories c ON p.category_id = c.id ';
        query += 'LEFT JOIN sub_categories s ON p.sub_category_id = s.id WHERE 1=1 ';

        const params = [];

        if (category) {
            query += ' AND c.slug = ? ';
            params.push(category);
        }
        if (subcategory) {
            query += ' AND s.slug = ? ';
            params.push(subcategory);
        }
        if (zodiac) {
            query += ' AND p.zodiac_sign = ? ';
            params.push(zodiac);
        }
        if (is_bestseller) {
            query += ' AND p.is_bestseller = TRUE ';
        }

        const [products] = await db.query(query, params);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Get Categories and Sub-categories
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        const [subCategories] = await db.query('SELECT * FROM sub_categories');

        const formatted = categories.map(cat => ({
            ...cat,
            subcategories: subCategories.filter(sub => sub.category_id === cat.id)
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// Product Suggestion Logic (Quiz Answer -> Tags)
router.post('/suggest', async (req, res) => {
    try {
        const { answers } = req.body; // Array of selected tags e.g. ["Career", "Success"]

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: 'Answers are required for suggestion' });
        }

        // Logic: Search for products that have any of these tags in their JSON tags column
        let query = 'SELECT * FROM products WHERE ';
        const conditions = answers.map(() => 'JSON_CONTAINS(tags, CAST(? AS JSON), "$")');
        query += conditions.join(' OR ');

        // Format tags correctly for JSON_CONTAINS (making them valid JSON strings like '"Career"')
        const params = answers.map(tag => JSON.stringify(tag));

        const [products] = await db.query(query, params);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suggestions', error: error.message });
    }
});

module.exports = router;
