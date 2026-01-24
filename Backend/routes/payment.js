import express from 'express';
import { connect } from '../db.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { getNextSequence } from '../models/Counter.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const uploadDir = 'uploads/payment-screenshots';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get payment settings (public)
router.get('/settings', async (req, res) => {
  try {
    await connect();
    const paymentSettings = await Payment.findOne({ is_active: true }).lean();
    if (!paymentSettings) {
      return res.status(404).json({ message: 'Payment settings not found' });
    }
    res.json(paymentSettings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment settings', error: error.message });
  }
});

// Upload payment screenshot for order
router.post('/upload-screenshot/:orderId', authenticateToken, upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    await connect();
    const order = await Order.findOne({ id: parseInt(req.params.orderId) });

    if (!order) {
      // Delete uploaded file if order not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to the authenticated user
    if (order.user_id !== req.user.id) {
      // Delete uploaded file if unauthorized
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Unauthorized to upload for this order' });
    }

    // Delete previous screenshot if exists
    if (order.payment_screenshot) {
      const oldPath = path.join(process.cwd(), order.payment_screenshot);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update order with screenshot
    order.payment_screenshot = `uploads/payment-screenshots/${req.file.filename}`;
    order.payment_screenshot_uploaded_at = new Date();
    order.payment_status = 'pending_approval';
    await order.save();

    res.json({
      message: 'Screenshot uploaded successfully',
      order: order
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading screenshot', error: error.message });
  }
});

// Get order with payment status (authenticated)
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    await connect();
    const order = await Order.findOne({ id: parseInt(req.params.orderId) }).lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to the authenticated user
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

export default router;
