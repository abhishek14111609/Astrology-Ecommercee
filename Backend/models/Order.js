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
  total_amount: Number,
  status: { type: String, default: 'pending' },
  payment_status: { type: String, default: 'pending' },
  items: { type: [OrderItemSchema], default: [] },
  created_at: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', OrderSchema, 'orders');
export default Order;
