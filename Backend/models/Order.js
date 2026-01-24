import { mongoose } from '../db.js';

const OrderItemSchema = new mongoose.Schema({
  product_id: Number,
  product_name: String,
  quantity: Number,
  price: Number,
  subtotal: Number,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  user_id: { type: Number, index: true },
  order_number: { type: String, unique: true },
  customer_name: String,
  customer_email: String,
  customer_phone: String,
  customer_address: String,
  total_amount: Number,
  status: { type: String, default: 'pending' },
  payment_status: { type: String, default: 'pending' },
  payment_method: { type: String, default: 'upi' },
  payment_screenshot: String, // File path or URL
  payment_screenshot_uploaded_at: Date,
  admin_approved: { type: Boolean, default: false },
  admin_approval_date: Date,
  admin_notes: String,
  rejection_reason: String,
  items: { type: [OrderItemSchema], default: [] },
  created_at: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', OrderSchema, 'orders');
export default Order;
