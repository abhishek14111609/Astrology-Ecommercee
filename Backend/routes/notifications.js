import express from 'express';
import { connect } from '../db.js';
import Notification from '../models/Notification.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's notifications
router.get('/my-notifications', verifyToken, async (req, res) => {
    try {
        await connect();
        const notifications = await Notification.find({ user_id: req.user.id })
            .sort({ created_at: -1 })
            .lean();
        // Ensure we always return an array
        res.json(Array.isArray(notifications) ? notifications : []);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        // Return empty array on error instead of error object
        res.status(500).json([]);
    }
});

// Mark notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
    try {
        await connect();
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
    }
});

// Mark all notifications as read
router.put('/mark-all-read', verifyToken, async (req, res) => {
    try {
        await connect();
        await Notification.updateMany(
            { user_id: req.user.id, read: false },
            { read: true }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark all as read', error: error.message });
    }
});

// Delete a notification
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await connect();
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete notification', error: error.message });
    }
});

// Delete all notifications (optional)
router.delete('/user/all', verifyToken, async (req, res) => {
    try {
        await connect();
        await Notification.deleteMany({ user_id: req.user.id });
        res.json({ message: 'All notifications deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete notifications', error: error.message });
    }
});

export default router;
