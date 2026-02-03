import express from 'express';
import { connect } from '../db.js';
import { getNextSequence } from '../models/Counter.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SubCategory from '../models/SubCategory.js';
import QuizQuestion from '../models/QuizQuestion.js';
import QuizOption from '../models/QuizOption.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { notifyOrderStatusUpdate } from '../utils/notifications.js';
import { applyWatermarkInPlace } from '../utils/watermark.js';
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
router.post('/upload-image', authenticateToken, isAdmin, uploadImageMiddleware.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
        
        const uploadedImagePath = req.file.path;
        
        // Apply watermark to the uploaded image
        try {
            await applyWatermarkInPlace(uploadedImagePath);
        } catch (watermarkError) {
            // Log the error but don't fail the upload - just serve without watermark
            console.error('Watermark application failed:', watermarkError);
        }
        
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
});

// --- Product Management ---
router.post('/products', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, slug, description, price, category_id, sub_category_id, zodiac_sign, image_url, is_bestseller, tags, stock } = req.body;
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
            stock: stock || 0,
        });
        res.status(201).json({ message: 'Product created', id: created.id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

router.put('/products/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, slug, description, price, category_id, sub_category_id, zodiac_sign, image_url, is_bestseller, tags, stock } = req.body;
        await connect();
        const updated = await Product.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            {
                name, slug, description, price, category_id, sub_category_id, zodiac_sign, image_url,
                is_bestseller: !!is_bestseller,
                tags: Array.isArray(tags) ? tags : [],
                stock: stock || 0
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
        
        // Fetch subcategories for each category
        for (const category of categories) {
            const subcategories = await SubCategory.find({ category_id: category.id }).sort({ id: 1 }).lean();
            category.subcategories = subcategories;
        }
        
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
        // Also delete associated options
        await QuizOption.deleteMany({ question_id: parseInt(req.params.id) });
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
});

// --- Quiz Options Management ---
router.get('/quiz/questions/:id/options', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const options = await QuizOption.find({ question_id: parseInt(req.params.id) })
            .sort({ order: 1 })
            .lean();
        res.json(options);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching options', error: error.message });
    }
});

router.post('/quiz/questions/:id/options', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { option_text, option_tag, order } = req.body;
        const question_id = parseInt(req.params.id);

        await connect();
        
        // Check if question exists
        const question = await QuizQuestion.findOne({ id: question_id });
        if (!question) return res.status(404).json({ message: 'Question not found' });

        const id = await getNextSequence('quiz_options');
        const created = await QuizOption.create({ 
            id, 
            question_id, 
            option_text, 
            option_tag, 
            order 
        });
        res.status(201).json({ message: 'Option created', data: created });
    } catch (error) {
        res.status(500).json({ message: 'Error creating option', error: error.message });
    }
});

router.put('/quiz/options/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { option_text, option_tag, order } = req.body;
        await connect();
        const updated = await QuizOption.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            { option_text, option_tag, order },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Option not found' });
        res.json({ message: 'Option updated', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating option', error: error.message });
    }
});

router.delete('/quiz/options/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const deleted = await QuizOption.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!deleted) return res.status(404).json({ message: 'Option not found' });
        res.json({ message: 'Option deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting option', error: error.message });
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

        // Populate customer names from user records if missing or "undefined undefined"
        for (const order of orders) {
            if (!order.customer_name || order.customer_name === 'undefined undefined' || order.customer_name === 'undefined') {
                if (order.user_id) {
                    const user = await User.findOne({ id: order.user_id }).lean();
                    if (user) {
                        order.customer_name = user.full_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown';
                        if (!order.customer_email && user.email) {
                            order.customer_email = user.email;
                        }
                    }
                }
                if (!order.customer_name || order.customer_name === 'undefined undefined') {
                    order.customer_name = 'Unknown Customer';
                }
            }
        }

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

        // Create notification if user_id exists
        if (updated.user_id) {
            await notifyOrderStatusUpdate(
                updated.user_id,
                updated.id,
                status,
                updated.order_number
            );
        }

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
            data = xlsx.utils.sheet_to_json(sheet, { 
                raw: false,
                defval: ''
            });
        } catch (parseError) {
            return res.status(400).json({ message: 'Failed to parse file. Ensure it is a valid Excel or CSV file.', error: parseError.message });
        }

        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'File is empty or has no data rows' });
        }

        console.log('First row keys:', Object.keys(data[0]));
        console.log('First row data:', data[0]);

        // Show normalization example for first row
        if (data.length > 0) {
            console.log('Sample column mapping:');
            const sampleRow = data[0];
            for (const key in sampleRow) {
                const cleanedKey = key.replace(/^\uFEFF/, '').trim();
                const normalizedKey = cleanedKey.toLowerCase().replace(/\s+/g, '_');
                console.log(`  "${key}" → "${normalizedKey}"`);
            }
        }

        const results = {
            success: [],
            failed: [],
            total: data.length
        };

        // Process each row
        for (const row of data) {
            try {
                // Normalize column names (handle different cases and spaces)
                const normalizedRow = {};
                const headerAliases = {
                    products: 'name',
                    product: 'name',
                    product_name: 'name',
                    price: 'price',
                    mrp: 'price',
                    amount: 'price',
                    categories: 'category_name',
                    category: 'category_name',
                    category_name: 'category_name',
                    sub_category: 'sub_category_name',
                    subcategory: 'sub_category_name',
                    sub_category_name: 'sub_category_name',
                    zodiac_signs: 'zodiac_sign',
                    zodiac_sign: 'zodiac_sign',
                    zodiac: 'zodiac_sign',
                    best_seller: 'is_bestseller',
                    bestseller: 'is_bestseller',
                    stocks: 'stock',
                    stock: 'stock',
                    descriptions: 'description',
                    description: 'description',
                    tags: 'tags',
                    tag: 'tags'
                };

                for (const key in row) {
                    const cleanedKey = key.replace(/^\uFEFF/, '').trim();
                    const normalizedKey = cleanedKey.toLowerCase().replace(/\s+/g, '_');
                    const mappedKey = headerAliases[normalizedKey] || normalizedKey;
                    normalizedRow[mappedKey] = row[key];
                }

                // Log first row mapping for debugging
                if (data.indexOf(row) === 1) { // Log second row (index 1) to see actual data
                    console.log('Row mapping for debugging:');
                    console.log('Original row:', row);
                    console.log('Normalized row:', normalizedRow);
                }

                // Fallback: detect name/price columns dynamically if not already mapped
                if (!normalizedRow.name || normalizedRow.name === '') {
                    const nameKey = Object.keys(row).find(k => /product|products|name/i.test(k));
                    if (nameKey) normalizedRow.name = row[nameKey];
                }
                if (!normalizedRow.price || normalizedRow.price === '') {
                    const priceKey = Object.keys(row).find(k => /price|mrp|amount/i.test(k));
                    if (priceKey) normalizedRow.price = row[priceKey];
                }

                // Trim and clean string values
                if (typeof normalizedRow.name === 'string') {
                    normalizedRow.name = normalizedRow.name.trim();
                }
                if (typeof normalizedRow.price === 'string') {
                    normalizedRow.price = normalizedRow.price.trim();
                    // Remove currency symbols and extra characters, keep only numbers and decimal
                    const cleanPrice = normalizedRow.price.replace(/[^0-9.]/g, '').trim();
                    normalizedRow.price = cleanPrice || normalizedRow.price; // Keep original if cleaning removes everything
                }

                // Ensure price is a valid number string
                if (normalizedRow.price !== undefined && normalizedRow.price !== null) {
                    const priceStr = String(normalizedRow.price).trim();
                    if (priceStr === '' || priceStr === '0' || priceStr === '0.00') {
                        normalizedRow.price = ''; // Mark as invalid
                    } else {
                        const numPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
                        if (!isNaN(numPrice) && numPrice > 0) {
                            normalizedRow.price = numPrice.toString();
                        } else {
                            normalizedRow.price = ''; // Mark as invalid
                        }
                    }
                } else {
                    normalizedRow.price = ''; // Mark as invalid if undefined
                }

                // Skip completely empty rows
                const hasAnyValue = Object.values(row).some(value => String(value).trim() !== '');
                if (!hasAnyValue) {
                    continue;
                }

                // Validate required fields
                if (!normalizedRow.name || !normalizedRow.price) {
                    const missingFields = [];
                    if (!normalizedRow.name) missingFields.push('name (Products column)');
                    if (!normalizedRow.price) missingFields.push('price (Price column)');
                    
                    results.failed.push({
                        row: row,
                        error: `Missing required fields: ${missingFields.join(' and ')}. Row values: name="${normalizedRow.name}", price="${normalizedRow.price}". Provided columns: ${Object.keys(row).join(', ')}`
                    });
                    continue;
                }

                // Generate slug if not provided
                const slug = normalizedRow.slug || normalizedRow.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                // Parse tags if string
                let tags = [];
                if (normalizedRow.tags) {
                    if (typeof normalizedRow.tags === 'string') {
                        tags = normalizedRow.tags.split(',').map(t => t.trim()).filter(t => t);
                    } else if (Array.isArray(normalizedRow.tags)) {
                        tags = normalizedRow.tags;
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

                // Resolve category/subcategory from names if provided
                let categoryId = normalizedRow.category_id ? parseInt(normalizedRow.category_id) : null;
                let subCategoryId = normalizedRow.sub_category_id ? parseInt(normalizedRow.sub_category_id) : null;

                if (!categoryId && normalizedRow.category_name) {
                    let rawCategory = String(normalizedRow.category_name).trim();
                    let rawSubCategory = '';

                    if (rawCategory.includes('>')) {
                        const [cat, sub] = rawCategory.split('>').map(s => s.trim());
                        rawCategory = cat;
                        rawSubCategory = sub || '';
                    } else if (rawCategory.includes('/')) {
                        const [cat, sub] = rawCategory.split('/').map(s => s.trim());
                        rawCategory = cat;
                        rawSubCategory = sub || '';
                    } else if (rawCategory.includes('|')) {
                        const [cat, sub] = rawCategory.split('|').map(s => s.trim());
                        rawCategory = cat;
                        rawSubCategory = sub || '';
                    }

                    let category = await Category.findOne({ name: new RegExp(`^${rawCategory}$`, 'i') }).lean();
                    if (!category) {
                        const newCatId = await getNextSequence('categories');
                        category = await Category.create({
                            id: newCatId,
                            name: rawCategory,
                            slug: rawCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                        });
                    }
                    categoryId = category.id;

                    if (rawSubCategory) {
                        let subCategory = await SubCategory.findOne({
                            category_id: categoryId,
                            name: new RegExp(`^${rawSubCategory}$`, 'i')
                        }).lean();
                        if (!subCategory) {
                            const newSubId = await getNextSequence('sub_categories');
                            subCategory = await SubCategory.create({
                                id: newSubId,
                                category_id: categoryId,
                                name: rawSubCategory,
                                slug: rawSubCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                            });
                        }
                        subCategoryId = subCategory.id;
                    }
                }

                // Create product
                const id = await getNextSequence('products');
                const product = await Product.create({
                    id,
                    name: normalizedRow.name,
                    slug: slug,
                    description: normalizedRow.description || '',
                    price: parseFloat(normalizedRow.price),
                    category_id: categoryId,
                    sub_category_id: subCategoryId,
                    zodiac_sign: normalizedRow.zodiac_sign || 'Aries',
                    image_url: normalizedRow.image_url || '',
                    is_bestseller: normalizedRow.is_bestseller === 'TRUE' || normalizedRow.is_bestseller === 'true' || normalizedRow.is_bestseller === true || normalizedRow.is_bestseller === '1' || normalizedRow.is_bestseller === 1,
                    tags: tags,
                    stock: normalizedRow.stock ? parseInt(normalizedRow.stock) : 0
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
