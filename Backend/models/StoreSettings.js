import { mongoose } from '../db.js';

const StoreSettingsSchema = new mongoose.Schema({
    site_name: { type: String, default: 'Auric Krystal' },
    support_email: { type: String, default: 'support@aurickrystal.com' },
    currency: { type: String, default: 'INR' },
    maintenance_mode: { type: Boolean, default: false },
    shipping_fee: { type: Number, default: 0 },
    updated_at: { type: Date, default: Date.now }
});

const StoreSettings = mongoose.model('StoreSettings', StoreSettingsSchema);
export default StoreSettings;
