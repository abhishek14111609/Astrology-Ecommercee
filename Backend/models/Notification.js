import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['order_status', 'booking_approved', 'booking_rejected', 'booking_pending', 'payment_confirmed'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false,
        index: true
    },
    related_id: {
        type: Number,
        description: 'ID of the related order or booking'
    },
    related_type: {
        type: String,
        enum: ['order', 'booking'],
        description: 'Type of related entity'
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { collection: 'notifications', timestamps: false });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
