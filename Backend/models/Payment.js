import { mongoose } from '../db.js';

const PaymentSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  payment_method: { type: String, enum: ['upi', 'bank_transfer'], default: 'upi' },
  upi_id: String,
  qr_code_image: String, // File path or URL
  bank_account: String,
  bank_ifsc: String,
  account_holder: String,
  instructions: [String], // Array of payment instructions
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', PaymentSchema, 'payment_settings');
export default Payment;
