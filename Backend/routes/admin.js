import express from 'express';
import { connect } from '../db.js';
import { getNextSequence } from '../models/Counter.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import QuizQuestion from '../models/QuizQuestion.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
const router = express.Router();

import { authenticateToken, isAdmin } from '../middleware/auth.js';

// Configure multer for file upload (Excel - Memory)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedMimetypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv', // .csv
            'application/csv'
        ];
        if (allowedMimetypes.includes(file.mimetype) || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed'));
        }
    }
});

// Configure multer for Image Upload (Disk)
const storageDisk = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadImageMiddleware = multer({
    storage: storageDisk,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Image Upload Route
router.post('/upload-image', authenticateToken, isAdmin, uploadImageMiddleware.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
});

// --- Product Management ---
router.post('/products', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, slug, description, price, category_id, sub_category_id, zodiac_sign, image_url, is_bestseller, tags } = req.body;
        await connect();
        const id = await getNextSequence('products');
        const created = await Product.create({
            id,
            name,
            slug,
            description,
            price,
            category_id,
            sub_category_id,
            zodiac_sign,
            image_url,
            is_bestseller: !!is_bestseller,
            tags: Array.isArray(tags) ? tags : [],
        });
        res.status(201).json({ message: 'Product created', id: created.id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

router.put('/products/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, slug, description, price, category_id, sub_category_id, zodiac_sign, image_url, is_bestseller, tags } = req.body;
        await connect();
        const updated = await Product.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            {
                name, slug, description, price, category_id, sub_category_id, zodiac_sign, image_url,
                is_bestseller: !!is_bestseller,
                tags: Array.isArray(tags) ? tags : []
            },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product updated', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

router.delete('/products/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const deleted = await Product.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// --- Category Management ---
router.post('/categories', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, slug, image_url } = req.body;
        await connect();
        const id = await getNextSequence('categories');
        const created = await Category.create({ id, name, slug, image_url });
        res.status(201).json({ message: 'Category created', id: created.id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
});

// --- Sub-category Management ---
router.post('/subcategories', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { category_id, name, slug } = req.body;
        await connect();
        const id = await getNextSequence('sub_categories');
        const created = await SubCategory.create({ id, category_id, name, slug });
        res.status(201).json({ message: 'Sub-category created', id: created.id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating sub-category', error: error.message });
    }
});

// --- Get All Sub-categories ---
router.get('/subcategories', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        // Join with Category to get parent name
        const subcategories = await SubCategory.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    id: 1,
                    name: 1,
                    slug: 1,
                    category_id: 1,
                    category_name: "$category.name"
                }
            },
            { $sort: { id: 1 } }
        ]);
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sub-categories', error: error.message });
    }
});

// --- Update Sub-category ---
router.put('/subcategories/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { category_id, name, slug } = req.body;
        await connect();
        const updated = await SubCategory.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            { category_id, name, slug },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Sub-category not found' });
        res.json({ message: 'Sub-category updated', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating sub-category', error: error.message });
    }
});

// --- Delete Sub-category ---
router.delete('/subcategories/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const deleted = await SubCategory.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!deleted) return res.status(404).json({ message: 'Sub-category not found' });
        res.json({ message: 'Sub-category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sub-category', error: error.message });
    }
});

// --- Get All Categories ---
router.get('/categories', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const categories = await Category.find().sort({ id: 1 }).lean();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// --- Update Category ---
router.put('/categories/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, slug, image_url } = req.body;
        await connect();
        const updated = await Category.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            { name, slug, image_url },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category updated', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
});

// --- Delete Category ---
router.delete('/categories/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const deleted = await Category.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!deleted) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
});

// --- Quiz Management ---
router.get('/quiz/questions', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const questions = await QuizQuestion.find().sort({ step_order: 1 }).lean();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
});

router.post('/quiz/questions', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { question_text, step_order } = req.body;
        await connect();
        const id = await getNextSequence('quiz_questions');
        const created = await QuizQuestion.create({ id, question_text, step_order });
        res.status(201).json({ message: 'Question created', id: created.id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating question', error: error.message });
    }
});

router.put('/quiz/questions/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { question_text, step_order } = req.body;
        await connect();
        const updated = await QuizQuestion.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            { question_text, step_order },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question updated', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating question', error: error.message });
    }
});

router.delete('/quiz/questions/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const deleted = await QuizQuestion.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!deleted) return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
});

// --- Orders Management ---
router.get('/orders', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const { status, page = 1, limit = 20 } = req.query;
        const query = status && status !== 'all' ? { status } : {};

        const orders = await Order.find(query)
            .sort({ created_at: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .lean();

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

router.get('/orders/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const order = await Order.findOne({ id: parseInt(req.params.id) }).lean();
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

router.put('/orders/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        await connect();
        const updated = await Order.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order status updated', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
});

// --- Customers Management ---
router.get('/customers', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const { page = 1, limit = 20, search = '' } = req.query;

        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const customers = await User.find(query)
            .select('-password')
            .sort({ created_at: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .lean();

        const total = await User.countDocuments(query);

        res.json({
            customers,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
});

router.get('/customers/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const customer = await User.findOne({ id: parseInt(req.params.id) }).select('-password').lean();
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        // Get customer orders
        const orders = await Order.find({ user_id: parseInt(req.params.id) })
            .sort({ created_at: -1 })
            .lean();

        res.json({ ...customer, orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
});

// --- Excel Bulk Upload ---
router.post('/products/upload-excel', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        await connect();

        // Parse Excel or CSV file (xlsx library handles CSVs too)
        let data = [];
        try {
            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            data = xlsx.utils.sheet_to_json(sheet);
        } catch (parseError) {
            return res.status(400).json({ message: 'Failed to parse file. Ensure it is a valid Excel or CSV file.', error: parseError.message });
        }

        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'File is empty' });
        }

        const results = {
            success: [],
            failed: [],
            total: data.length
        };

        // Process each row
        for (const row of data) {
            try {
                // Validate required fields
                if (!row.name || !row.price) {
                    results.failed.push({
                        row: row,
                        error: 'Missing required fields: name or price'
                    });
                    continue;
                }

                // Generate slug if not provided
                const slug = row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                // Parse tags if string
                let tags = [];
                if (row.tags) {
                    if (typeof row.tags === 'string') {
                        tags = row.tags.split(',').map(t => t.trim());
                    } else if (Array.isArray(row.tags)) {
                        tags = row.tags;
                    }
                }

                // Check if product already exists
                const existingProduct = await Product.findOne({ slug }).lean();
                if (existingProduct) {
                    results.failed.push({
                        row: row,
                        error: 'Product with this slug already exists'
                    });
                    continue;
                }

                // Create product
                const id = await getNextSequence('products');
                const product = await Product.create({
                    id,
                    name: row.name,
                    slug: slug,
                    description: row.description || '',
                    price: parseFloat(row.price),
                    category_id: row.category_id || null,
                    sub_category_id: row.sub_category_id || null,
                    zodiac_sign: row.zodiac_sign || 'Aries',
                    image_url: row.image_url || '',
                    is_bestseller: row.is_bestseller === 'TRUE' || row.is_bestseller === true || row.is_bestseller === 1,
                    tags: tags,
                    stock: row.stock ? parseInt(row.stock) : 0
                });

                results.success.push({
                    name: product.name,
                    id: product.id
                });

            } catch (err) {
                results.failed.push({
                    row: row,
                    error: err.message
                });
            }
        }

        res.json({
            message: 'Excel upload processed',
            results: {
                total: results.total,
                successful: results.success.length,
                failed: results.failed.length,
                successList: results.success,
                failedList: results.failed
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error processing Excel file', error: error.message });
    }
});

export default router;
