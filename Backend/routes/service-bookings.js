import express from 'express';
import { connect } from '../db.js';
import ServiceBooking from '../models/ServiceBooking.js';
import User from '../models/User.js';
import { getNextSequence } from '../models/Counter.js';
import { verifyToken } from '../middleware/auth.js';
import { notifyBookingStatusUpdate } from '../utils/notifications.js';

const router = express.Router();

// Create a new service booking (User)
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { service_title, service_subtitle, service_price, preferred_date, preferred_time, message } = req.body;
        
        await connect();

        const id = await getNextSequence('service_bookings');

        const user = await User.findOne({ id: req.user.id }).lean();

        const booking = await ServiceBooking.create({
            id,
            user_id: req.user.id,
            user_name: user?.name || '',
            user_email: user?.email || req.user.email,
            user_phone: user?.phone || '',
            service_title,
            service_subtitle,
            service_price,
            preferred_date,
            preferred_time,
            message,
            status: 'pending'
        });

        res.status(201).json({ 
            message: 'Booking request submitted successfully', 
            booking 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
});

// Get user's bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        await connect();
        const bookings = await ServiceBooking.find({ user_id: req.user.id }).sort({ created_at: -1 }).lean();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

// Get all bookings (Admin)
router.get('/all', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await connect();
        const bookings = await ServiceBooking.find().sort({ created_at: -1 }).lean();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

// Update booking status (Admin)
router.put('/update-status/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { status, admin_notes } = req.body;
        await connect();

        const booking = await ServiceBooking.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            { status, admin_notes, updated_at: Date.now() },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Create notification for the user
        await notifyBookingStatusUpdate(
            booking.user_id,
            booking.id,
            status,
            booking.service_title
        );

        res.json({ message: 'Booking status updated', booking });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update booking', error: error.message });
    }
});

export default router;
