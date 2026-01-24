import express from 'express';
import { connect } from '../db.js';
import StoreSettings from '../models/StoreSettings.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get Settings (Admin Only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        // Return existing settings or create default
        let settings = await StoreSettings.findOne();
        if (!settings) {
            settings = await StoreSettings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
    }
});

// Update Settings (Admin Only)
router.put('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        await connect();
        const settings = await StoreSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update settings', error: error.message });
    }
});

export default router;
