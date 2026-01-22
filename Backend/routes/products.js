import express from 'express';
import { connect } from '../db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
    try {
        const { category, subcategory, zodiac, is_bestseller } = req.query;
        await connect();

        const filter = {};
        if (category) {
            const cat = await Category.findOne({ slug: category }).lean();
            if (cat) filter.category_id = cat.id; else return res.json([]);
        }
        if (subcategory) {
            const sub = await SubCategory.findOne({ slug: subcategory }).lean();
            if (sub) filter.sub_category_id = sub.id; else return res.json([]);
        }
        if (zodiac) filter.zodiac_sign = zodiac;
        if (is_bestseller) filter.is_bestseller = true;

        const products = await Product.find(filter).lean();
        const catIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
        const subIds = [...new Set(products.map(p => p.sub_category_id).filter(Boolean))];
        const cats = await Category.find({ id: { $in: catIds } }).lean();
        const subs = await SubCategory.find({ id: { $in: subIds } }).lean();
        const catMap = Object.fromEntries(cats.map(c => [c.id, c.name]));
        const subMap = Object.fromEntries(subs.map(s => [s.id, s.name]));

        const enriched = products.map(p => ({
            ...p,
            category_name: catMap[p.category_id] || null,
            subcategory_name: subMap[p.sub_category_id] || null,
        }));

        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Get Categories and Sub-categories
router.get('/categories', async (req, res) => {
    try {
        await connect();
        const categories = await Category.find({}).lean();
        const subCategories = await SubCategory.find({}).lean();
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
        await connect();
        const products = await Product.find({ tags: { $in: answers } }).lean();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suggestions', error: error.message });
    }
});

export default router;
