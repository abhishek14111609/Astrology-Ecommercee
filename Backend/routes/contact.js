import express from 'express';
import { connect } from '../db.js';
import Contact from '../models/Contact.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        await connect();

        const newContact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({ message: 'Message sent successfully', contact: newContact });

    } catch (error) {
        console.error("Contact Error:", error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
});

import { authenticateToken, isAdmin } from '../middleware/auth.js';

// Get all inquiries (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const contacts = await Contact.find().sort({ created_at: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message });
    }
});

// Delete an inquiry
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete inquiry', error: error.message });
    }
});

export default router;
