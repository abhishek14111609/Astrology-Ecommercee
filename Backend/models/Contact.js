import { mongoose } from '../db.js';

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: 'new' } // new, read, replied
});

const Contact = mongoose.model('Contact', ContactSchema);
export default Contact;
