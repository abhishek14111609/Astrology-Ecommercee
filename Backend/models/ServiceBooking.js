import { mongoose } from '../db.js';

const ServiceBookingSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  user_id: { type: Number, ref: 'User', required: true },
  user_name: String,
  user_email: String,
  user_phone: String,
  service_title: { type: String, required: true },
  service_subtitle: String,
  service_price: String,
  preferred_date: Date,
  preferred_time: String,
  message: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  admin_notes: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const ServiceBooking = mongoose.model('ServiceBooking', ServiceBookingSchema, 'service_bookings');
export default ServiceBooking;
