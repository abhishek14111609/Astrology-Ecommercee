import express from 'express';
import { connect } from '../db.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for QR code uploads
const uploadDir = 'uploads/qr-codes';
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all pending payment verifications
router.get('/pending-payments', authenticateToken, async (req, res) => {
  try {
    await connect();
    const pendingOrders = await Order.find({ payment_status: 'pending_approval' }).sort({ payment_screenshot_uploaded_at: 1 }).lean();
    res.json(pendingOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending payments', error: error.message });
  }
});

// Get payment verification history (recent approved/rejected)
router.get('/history', authenticateToken, async (req, res) => {
  try {
    await connect();
    const history = await Order.find({ payment_status: { $in: ['verified', 'rejected', 'approved', 'completed'] } })
      .sort({ payment_screenshot_uploaded_at: -1, updated_at: -1 })
      .limit(50)
      .lean();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment history', error: error.message });
  }
});

// Approve payment
router.post('/approve-payment/:orderId', authenticateToken, async (req, res) => {
  try {
    const { adminNotes } = req.body;
    await connect();

    const order = await Order.findOne({ id: parseInt(req.params.orderId) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.payment_status = 'verified';
    order.admin_approved = true;
    order.admin_approval_date = new Date();
    order.admin_notes = adminNotes || '';
    order.status = 'confirmed';
    await order.save();

    res.json({
      message: 'Payment approved successfully',
      order: order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving payment', error: error.message });
  }
});

// Reject payment
router.post('/reject-payment/:orderId', authenticateToken, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    await connect();

    const order = await Order.findOne({ id: parseInt(req.params.orderId) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete screenshot
    if (order.payment_screenshot) {
      const filePath = path.join(process.cwd(), order.payment_screenshot);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    order.payment_status = 'rejected';
    order.payment_screenshot = null;
    order.rejection_reason = rejectionReason || 'Payment rejected';
    order.admin_notes = `Rejected: ${rejectionReason || 'Invalid payment proof'}`;
    order.status = 'payment_rejected';
    await order.save();

    res.json({
      message: 'Payment rejected',
      order: order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting payment', error: error.message });
  }
});

// Update payment settings
router.post('/settings', authenticateToken, upload.single('qrCode'), async (req, res) => {
  try {
    const { upi_id, account_holder, instructions } = req.body;
    await connect();

    let paymentSettings = await Payment.findOne({});

    if (!paymentSettings) {
      paymentSettings = new Payment({
        id: 1 // Single payment settings record
      });
    }

    if (upi_id) paymentSettings.upi_id = upi_id;
    if (account_holder) paymentSettings.account_holder = account_holder;
    if (instructions) {
      paymentSettings.instructions = Array.isArray(instructions) ? instructions : [instructions];
    }

    if (req.file) {
      // Delete old QR code if exists
      if (paymentSettings.qr_code_image) {
        const oldPath = path.join(process.cwd(), paymentSettings.qr_code_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      paymentSettings.qr_code_image = `uploads/qr-codes/${req.file.filename}`;
    }

    paymentSettings.is_active = true;
    paymentSettings.updated_at = new Date();
    await paymentSettings.save();

    res.json({
      message: 'Payment settings updated',
      settings: paymentSettings
    });
  } catch (error) {
    console.error('Error updating payment settings:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// Get payment settings (admin view)
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    await connect();
    const paymentSettings = await Payment.findOne({}).lean();
    res.json(paymentSettings || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

export default router;
